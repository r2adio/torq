import { getTorrentInfo, getTorrentDisplayInfo } from "@/core/torrent.service";
import { computeInfoHash } from "@/utils/buffer";
import { decodeBencode } from "@/utils/bencode";

const PROTOCOL_STRING = "BitTorrent protocol";
const PROTOCOL_STRING_LENGTH = 19;
const CONNECT_TIMEOUT_MS = 5000;
const TRACKER_TIMEOUT_MS = 8000;

// generate random 20-byte peer ID
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

export async function performHandshake(
  torrentPath: string,
  peerAddress: string,
): Promise<string> {
  const parts = peerAddress.split(":");
  const ip = parts[0]!;
  const port = parseInt(parts[1]!, 10);

  const torrentInfo = getTorrentInfo(torrentPath);
  const infoHashHex = computeInfoHash(torrentInfo._rawInfo);
  const infoHash = Buffer.from(infoHashHex, "hex");

  const peerId = generatePeerId();
  const handshake = buildHandshake(infoHash, peerId);

  return new Promise<string>(async (resolve, reject) => {
    let isSettled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const settle = (
      callback: (value?: string | Error) => void,
      value?: string | Error,
    ) => {
      if (isSettled) return;
      isSettled = true;
      if (timeoutId) clearTimeout(timeoutId);
      callback(value);
    };

    try {
      const socket = await Bun.connect({
        hostname: ip,
        port: port,
        socket: {
          data(socket, data) {
            if (data.length >= 68) {
              const receivedPeerId = data.subarray(48, 68);
              const peerIdHex = receivedPeerId.toString("hex");
              socket.end();
              settle((value) => resolve(value as string), peerIdHex);
            }
          },
          error(socket, error) {
            socket.end();
            settle(
              (value) => reject(value),
              new Error(
                `Peer connection error for ${peerAddress}: ${error.message}`,
              ),
            );
          },
          close() {
            settle(
              (value) => reject(value),
              new Error(
                `Connection closed before handshake completed for ${peerAddress}`,
              ),
            );
          },
        },
      });

      timeoutId = setTimeout(() => {
        socket.end();
        settle(
          (value) => reject(value),
          new Error(
            `Handshake timed out after ${CONNECT_TIMEOUT_MS}ms for ${peerAddress}`,
          ),
        );
      }, CONNECT_TIMEOUT_MS);

      socket.write(handshake);
    } catch (error: any) {
      settle(
        (value) => reject(value),
        new Error(`Unable to connect to ${peerAddress}: ${error.message}`),
      );
    }
  });
}

export async function getPeers(torrentPath: string): Promise<string[]> {
  const info = getTorrentDisplayInfo(torrentPath);
  // convert infoHash(40 char) to raw 20 bytes, and percent-encode each byte
  const rawInfoHash = Buffer.from(info.infoHash, "hex");
  const encodedInfoHash = Array.from(rawInfoHash)
    .map((b) => `%${b.toString(16).padStart(2, "0")}`)
    .join("");

  // peer_id: 20 bytes, format: -<client(2)><version(2)><subversion(2)><random(14)>
  // INFO: -TR2820-123456789012 = Transmission v2.8.20
  const url = `${info.trackerUrl}?info_hash=${encodedInfoHash}&peer_id=-TR2820-123456789012&port=6881&uploaded=0&downloaded=0&left=${info.infoLength}&compact=1`;
  const res = await fetch(url, {
    // timeout helps to avoid indefinite hangs on tracker fetch
    signal: AbortSignal.timeout(TRACKER_TIMEOUT_MS),
  });
  const responseBuffer = await res.arrayBuffer();
  const response = decodeBencode(Buffer.from(responseBuffer));

  if (response["failure reason"])
    throw new Error(`Tracker error: ${response["failure reason"]}`);

  if (!response.peers || !Buffer.isBuffer(response.peers)) return [];

  const peersBuffer: Buffer = response.peers;
  const peers: string[] = [];
  for (let i = 0; i < peersBuffer.length; i += 6) {
    // compact peer list: 6 bytes/peer (ip -> 4, port -> 2)
    const ip = `${peersBuffer[i]}.${peersBuffer[i + 1]}.${peersBuffer[i + 2]}.${peersBuffer[i + 3]}`;
    const port = (peersBuffer[i + 4]! << 8) | peersBuffer[i + 5]!;
    peers.push(`${ip}:${port}`);
  }
  return peers;
}
