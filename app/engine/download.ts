import crypto from "crypto";
import net from "net";
import { getTorrentInfo } from "@/core/torrent.service";
import { getPeers } from "@/core/peer.service";
import { computeInfoHash } from "@/utils/buffer";
import {
  buildInterestedMessage,
  buildRequestMessage,
  parsePieceMessage,
  MESSAGE_TYPES,
} from "@/core/message.service";
import type {
  FileDownloadOptions,
  PieceChunk,
  PieceDownloadOptions,
} from "@/engine/types";

const PROTOCOL_STRING = "BitTorrent protocol";
const PROTOCOL_STRING_LENGTH = 19;
const BLOCK_SIZE = 16 * 1024;
const PEER_CONNECT_TIMEOUT_MS = 5000;
const PIECE_DOWNLOAD_TIMEOUT_MS = 20000;

type PieceTransferPlan = {
  pieceIndex: number;
  pieceSize: number;
};

type TorrentDownloadContext = {
  pieceLength: number;
  infoLength: number;
  pieceHash: string[];
  infoHash: Buffer;
};

function generatePeerId(): Buffer {
  const peerId = Buffer.alloc(20);
  for (let i = 0; i < 20; i++) peerId[i] = Math.floor(Math.random() * 256);
  return peerId;
}

function buildHandshake(infoHash: Buffer, peerId: Buffer): Buffer {
  const handshake = Buffer.alloc(68);
  handshake.writeUInt8(PROTOCOL_STRING_LENGTH, 0);
  handshake.write(PROTOCOL_STRING, 1, "ascii");
  handshake.writeUInt32BE(0, 20);
  handshake.writeUInt32BE(0, 24);
  infoHash.copy(handshake, 28);
  peerId.copy(handshake, 48);
  return handshake;
}

function computePieceSize(
  pieceIndex: number,
  pieceLength: number,
  totalLength: number,
): number {
  const isLastPiece = (pieceIndex + 1) * pieceLength > totalLength;
  return isLastPiece ? totalLength - pieceIndex * pieceLength : pieceLength;
}

function prepareTorrentDownloadContext(
  torrentPath: string,
): TorrentDownloadContext {
  const decoded = getTorrentInfo(torrentPath);
  const pieces = decoded.info.pieces as Buffer;
  if (pieces.length % 20 !== 0)
    throw new Error("Invalid pieces length in torrent file.");

  const pieceHash: string[] = [];
  for (let i = 0; i < pieces.length; i += 20)
    pieceHash.push(pieces.subarray(i, i + 20).toString("hex"));

  return {
    pieceLength: decoded.info["piece length"],
    infoLength: decoded.info.length,
    pieceHash,
    infoHash: Buffer.from(computeInfoHash(decoded._rawInfo), "hex"),
  };
}

async function requestPieceWithPeerSession(
  peerAddress: string,
  infoHash: Buffer,
  transferPlan: PieceTransferPlan,
): Promise<Buffer> {
  const parts = peerAddress.split(":");
  const ip = parts[0]!;
  const port = parseInt(parts[1]!, 10);

  const peerId = generatePeerId();
  const handshake = buildHandshake(infoHash, peerId);

  return new Promise<Buffer>((resolve, reject) => {
    let receivedData = Buffer.alloc(0);
    const pieceData = Buffer.alloc(transferPlan.pieceSize);
    let handshakeComplete = false;
    let downloadedBytes = 0;
    let requestsSent = false;
    const receivedBlocks = new Set<number>();

    let isSettled = false;
    let connectTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let downloadTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let socketRef: net.Socket | null = null;

    const clearTimers = () => {
      if (connectTimeoutId) clearTimeout(connectTimeoutId);
      if (downloadTimeoutId) clearTimeout(downloadTimeoutId);
      connectTimeoutId = null;
      downloadTimeoutId = null;
    };

    const settle = ({ value, error }: { value?: Buffer; error?: Error }) => {
      if (isSettled) return;
      isSettled = true;
      clearTimers();
      if (socketRef) socketRef.destroy();
      if (error) {
        reject(error);
        return;
      }
      resolve(value!);
    };

    const settleResolve = (value: Buffer) => settle({ value });
    const settleReject = (error: Error) => settle({ error });

    const connectWithTimeout = async (): Promise<net.Socket> => {
      const socket = net.connect({ host: ip, port });

      socket.on("data", (data) => {
        if (isSettled) return;

        try {
          receivedData = Buffer.concat([receivedData, Buffer.from(data)]);

          if (!handshakeComplete && receivedData.length >= 68) {
            const protocolLength = receivedData.readUInt8(0);
            const protocol = receivedData
              .subarray(1, 1 + PROTOCOL_STRING_LENGTH)
              .toString("ascii");
            const responseInfoHash = receivedData.subarray(28, 48);

            if (protocolLength !== PROTOCOL_STRING_LENGTH)
              return settleReject(
                new Error(`Invalid handshake pstrlen from ${peerAddress}`),
              );
            if (protocol !== PROTOCOL_STRING)
              return settleReject(
                new Error(`Invalid handshake protocol from ${peerAddress}`),
              );
            if (!responseInfoHash.equals(infoHash))
              return settleReject(
                new Error(`Mismatched info-hash from ${peerAddress}`),
              );

            receivedData = receivedData.subarray(68);
            handshakeComplete = true;
            socket.write(buildInterestedMessage());
          }

          while (handshakeComplete && receivedData.length >= 4) {
            const messageLength = receivedData.readUInt32BE(0);
            if (messageLength === 0) {
              receivedData = receivedData.subarray(4);
              continue;
            }
            if (receivedData.length < 4 + messageLength) break;

            const messageId = receivedData.readUInt8(4);
            const payload = receivedData.subarray(5, 4 + messageLength);
            receivedData = receivedData.subarray(4 + messageLength);

            if (messageId === MESSAGE_TYPES.UNCHOKE && !requestsSent) {
              requestsSent = true;
              const numBlocks = Math.ceil(transferPlan.pieceSize / BLOCK_SIZE);
              for (let i = 0; i < numBlocks; i++) {
                const begin = i * BLOCK_SIZE;
                const length = Math.min(
                  BLOCK_SIZE,
                  transferPlan.pieceSize - begin,
                );
                socket.write(
                  buildRequestMessage(transferPlan.pieceIndex, begin, length),
                );
              }
            }

            if (messageId === MESSAGE_TYPES.PIECE) {
              if (payload.length < 8)
                return settleReject(
                  new Error(`Malformed PIECE payload from ${peerAddress}`),
                );

              const { index, begin, block } = parsePieceMessage(payload);
              if (index !== transferPlan.pieceIndex) continue;
              if (begin < 0 || begin >= transferPlan.pieceSize)
                return settleReject(
                  new Error(`Invalid PIECE begin offset from ${peerAddress}`),
                );

              const maxBlockLength = transferPlan.pieceSize - begin;
              if (block.length <= 0 || block.length > maxBlockLength)
                return settleReject(
                  new Error(`Invalid PIECE block length from ${peerAddress}`),
                );

              if (receivedBlocks.has(begin)) continue;
              receivedBlocks.add(begin);
              block.copy(pieceData, begin);
              downloadedBytes += block.length;

              if (downloadedBytes >= transferPlan.pieceSize)
                return settleResolve(pieceData);
            }
          }
        } catch (error: any) {
          settleReject(
            new Error(
              `Failed parsing peer message from ${peerAddress}: ${error.message}`,
            ),
          );
        }
      });

      socket.on("error", (error) => {
        settleReject(
          new Error(
            `Peer connection error for ${peerAddress}: ${error.message}`,
          ),
        );
      });

      socket.on("close", () => {
        if (downloadedBytes < transferPlan.pieceSize) {
          settleReject(
            new Error(
              `Connection closed before piece download completed (${downloadedBytes}/${transferPlan.pieceSize} bytes) for ${peerAddress}`,
            ),
          );
        }
      });

      await new Promise<void>((resolve, reject) => {
        connectTimeoutId = setTimeout(() => {
          socket.destroy();
          reject(
            new Error(
              `Peer connect timed out after ${PEER_CONNECT_TIMEOUT_MS}ms for ${peerAddress}`,
            ),
          );
        }, PEER_CONNECT_TIMEOUT_MS);

        socket.once("connect", () => {
          if (connectTimeoutId) {
            clearTimeout(connectTimeoutId);
            connectTimeoutId = null;
          }
          resolve();
        });
      });

      return socket;
    };

    connectWithTimeout()
      .then((socket) => {
        socketRef = socket;
        if (isSettled) {
          socket.end();
          return;
        }

        downloadTimeoutId = setTimeout(() => {
          settleReject(
            new Error(
              `Piece download timed out after ${PIECE_DOWNLOAD_TIMEOUT_MS}ms (${downloadedBytes}/${transferPlan.pieceSize} bytes) from ${peerAddress}`,
            ),
          );
        }, PIECE_DOWNLOAD_TIMEOUT_MS);

        socket.write(handshake);
      })
      .catch((error: any) => {
        settleReject(
          new Error(
            `Unable to connect to peer ${peerAddress}: ${error.message}`,
          ),
        );
      });
  });
}

async function downloadPieceFromPeers(
  pieceIndex: number,
  peers: string[],
  torrentContext: TorrentDownloadContext,
): Promise<Buffer> {
  const expectedHash = torrentContext.pieceHash[pieceIndex];
  if (!expectedHash)
    throw new Error(
      `Invalid piece index ${pieceIndex}. Torrent has ${torrentContext.pieceHash.length} pieces.`,
    );

  const pieceSize = computePieceSize(
    pieceIndex,
    torrentContext.pieceLength,
    torrentContext.infoLength,
  );

  let lastPeerError: Error | null = null;
  for (const peer of peers) {
    try {
      const pieceData = await requestPieceWithPeerSession(
        peer,
        torrentContext.infoHash,
        {
          pieceIndex,
          pieceSize,
        },
      );

      const actualHash = crypto
        .createHash("sha1")
        .update(pieceData)
        .digest("hex");
      if (actualHash === expectedHash) return pieceData;
      lastPeerError = new Error(
        `Hash mismatch from peer ${peer}. Expected: ${expectedHash}, Got: ${actualHash}`,
      );
    } catch (error: any) {
      lastPeerError = new Error(
        `Failed to download from ${peer}: ${error.message}`,
      );
    }
  }

  throw new Error(
    lastPeerError
      ? `Failed to download piece from any peer. Last error: ${lastPeerError.message}`
      : "Failed to download piece from any peer",
  );
}

// returns a Buffer (as before)
export const downloadPiece = async (
  options: PieceDownloadOptions,
): Promise<Buffer> => {
  const { torrentPath, pieceIndex } = options;
  const peers = options.peers ?? (await getPeers(torrentPath));
  if (peers.length === 0) throw new Error("No peers available for download");

  const torrentContext = prepareTorrentDownloadContext(torrentPath);
  return downloadPieceFromPeers(pieceIndex, peers, torrentContext);
};

// uses async generator yielding {index, data}
export const downloadFilePieces = async function* (
  options: FileDownloadOptions,
): AsyncGenerator<PieceChunk, void> {
  const { torrentPath } = options;
  const torrentContext = prepareTorrentDownloadContext(torrentPath);
  const totalPieces = torrentContext.pieceHash.length;
  if (totalPieces === 0) throw new Error("Torrent contains no pieces");

  const peers = options.peers ?? (await getPeers(torrentPath));
  if (peers.length === 0) throw new Error("No peers available for download");

  for (let pieceIndex = 0; pieceIndex < totalPieces; pieceIndex++) {
    const data = await downloadPieceFromPeers(
      pieceIndex,
      peers,
      torrentContext,
    );
    yield { index: pieceIndex, data };
  }
};
