import fs from "fs";
import crypto from "crypto";
import { getTorrentInfo, getTorrentDisplayInfo } from "@/core/torrent.service";
import { getPeers } from "@/core/peer.service";
import { computeInfoHash } from "@/utils/buffer";
import {
  buildInterestedMessage,
  buildRequestMessage,
  parseMessage,
  parsePieceMessage,
  MESSAGE_TYPES,
} from "@/core/message.service";

const PROTOCOL_STRING = "BitTorrent protocol";
const PROTOCOL_STRING_LENGTH = 19;
const BLOCK_SIZE = 16 * 1024;

function generatePeerId(): Buffer {
  const peerId = Buffer.alloc(20); // peer-ID for BitTorrent protocol identification
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

async function downloadPieceFromPeer(
  peerAddress: string,
  torrentPath: string,
  pieceIndex: number,
  pieceLength: number,
  totalLength: number,
): Promise<Buffer> {
  const parts = peerAddress.split(":");
  const ip = parts[0]!;
  const port = parseInt(parts[1]!, 10);

  const torrentInfo = getTorrentInfo(torrentPath);
  const infoHashHex = computeInfoHash(torrentInfo._rawInfo);
  const infoHash = Buffer.from(infoHashHex, "hex");

  const peerId = generatePeerId();
  const handshake = buildHandshake(infoHash, peerId);

  // calculate actual piece size (last piece might be small)
  const isLastPiece = (pieceIndex + 1) * pieceLength > totalLength;
  const actualPieceSize = isLastPiece
    ? totalLength - pieceIndex * pieceLength
    : pieceLength;

  return new Promise<Buffer>(async (resolve, reject) => {
    let receivedData = Buffer.alloc(0);
    let pieceData = Buffer.alloc(actualPieceSize);
    let handshakeComplete = false;
    let unchokedReceived = false;
    let downloadedBytes = 0;

    const socket = await Bun.connect({
      hostname: ip,
      port: port,
      socket: {
        data(socket, data) {
          receivedData = Buffer.concat([receivedData, Buffer.from(data)]);

          // Handle handshake response
          if (!handshakeComplete && receivedData.length >= 68) {
            receivedData = receivedData.subarray(68);
            handshakeComplete = true;

            // Send interested message
            socket.write(buildInterestedMessage());
          }

          // Parse messages
          while (receivedData.length >= 4) {
            const messageLength = receivedData.readUInt32BE(0);

            // Keep-alive message
            if (messageLength === 0) {
              receivedData = receivedData.subarray(4);
              continue;
            }

            // Check if we have complete message
            if (receivedData.length < 4 + messageLength) break;

            const messageId = receivedData.readUInt8(4);
            const payload = receivedData.subarray(5, 4 + messageLength);
            receivedData = receivedData.subarray(4 + messageLength);

            // Handle unchoke message
            if (messageId === MESSAGE_TYPES.UNCHOKE) {
              unchokedReceived = true;

              // Request all blocks for the piece
              const numBlocks = Math.ceil(actualPieceSize / BLOCK_SIZE);
              for (let i = 0; i < numBlocks; i++) {
                const begin = i * BLOCK_SIZE;
                const length = Math.min(BLOCK_SIZE, actualPieceSize - begin);
                socket.write(buildRequestMessage(pieceIndex, begin, length));
              }
            }

            // Handle piece message
            if (messageId === MESSAGE_TYPES.PIECE) {
              const { index, begin, block } = parsePieceMessage(payload);

              if (index === pieceIndex) {
                block.copy(pieceData, begin);
                downloadedBytes += block.length;

                // Check if download is complete
                if (downloadedBytes >= actualPieceSize) {
                  socket.end();
                  resolve(pieceData);
                }
              }
            }

            // Handle bitfield message (ignore for now)
            if (messageId === MESSAGE_TYPES.BITFIELD) {
              // Peer sends available pieces, we ignore this for single piece download
            }
          }
        },
        error(socket, error) {
          reject(error);
        },
        close(socket) {
          if (downloadedBytes < actualPieceSize) {
            reject(
              new Error(
                `Connection closed before piece download completed (${downloadedBytes}/${actualPieceSize} bytes)`,
              ),
            );
          }
        },
      },
    });

    socket.write(handshake);
  });
}

export const download_piece = async () => {
  if (process.argv[3] !== "-o")
    return console.error(
      "Usage: download_piece -o <output_path> <torrent_path> <piece_index>",
    );
  const outputPath: string =
    process.argv[4] ??
    prompt("Enter the output path for the downloaded piece:") ??
    "";
  const torrentPath: string =
    process.argv[5] ?? prompt("Enter the path to the torrent file:") ?? "";
  const pieceIndex: number = parseInt(
    process.argv[6] ?? prompt("Enter the piece index to download:") ?? "",
    10,
  );
  try {
    console.log("Downloading piece index:", pieceIndex);

    // torrent info and piece hash from .torrent
    const torrentInfo = getTorrentDisplayInfo(torrentPath);
    const expectedHash = torrentInfo.pieceHash[pieceIndex];
    if (!expectedHash)
      throw new Error(
        `Invalid piece index ${pieceIndex}. Torrent has ${torrentInfo.pieceHash.length} pieces.`,
      );

    // peers from tracker
    console.log("Fetching peers from tracker...");
    const peers = await getPeers(torrentPath);
    if (peers.length === 0) throw new Error("No peers available for download");

    console.log(`Found ${peers.length} peers. Attempting download...`);

    // downloads from each and every peer until success
    let pieceData: Buffer | null = null;
    for (const peer of peers) {
      try {
        console.log(`Trying peer: ${peer}`);
        pieceData = await downloadPieceFromPeer(
          peer,
          torrentPath,
          pieceIndex,
          torrentInfo.pieceLength,
          torrentInfo.infoLength,
        );

        // verify piece hash
        const actualHash = crypto
          .createHash("sha1")
          .update(pieceData)
          .digest("hex");
        if (actualHash === expectedHash) {
          console.log("Piece downloaded and verified successfully!");
          break;
        } else {
          console.log(
            `Hash mismatch from peer ${peer}. Expected: ${expectedHash}, Got: ${actualHash}`,
          );
          pieceData = null;
        }
      } catch (error: any) {
        console.log(`Failed to download from ${peer}: ${error.message}`);
        continue;
      }
    }
    if (!pieceData) throw new Error("Failed to download piece from any peer");

    // save downloaded piece to disk
    fs.writeFileSync(outputPath, pieceData);
    console.log(`Piece ${pieceIndex} saved to ${outputPath}`);
  } catch (error: any) {
    console.error("Error fetching a piece:", error.message);
  }
};

export const download = async () => {};
