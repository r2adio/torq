import { getTorrentInfo } from "@/core/torrent.service";
import { computeInfoHash } from "@/utils/buffer";

const PROTOCOL_STRING = "BitTorrent protocol";
const PROTOCOL_STRING_LENGTH = 19;

function generatePeerId(): Buffer {
  const peerId = Buffer.alloc(20);
  for (let i = 0; i < 20; i++) {
    peerId[i] = Math.floor(Math.random() * 256);
  }
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

  let resolveHandshake!: (value: string) => void;
  let rejectHandshake!: (reason: any) => void;

  const handshakePromise = new Promise<string>((resolve, reject) => {
    resolveHandshake = resolve;
    rejectHandshake = reject;
  });

  const socket = await Bun.connect({
    hostname: ip,
    port: port,
    socket: {
      data(socket, data) {
        if (data.length >= 68) {
          const receivedPeerId = data.subarray(48, 68);
          const peerIdHex = receivedPeerId.toString("hex");
          socket.end();
          resolveHandshake(peerIdHex);
        }
      },
      error(socket, error) {
        rejectHandshake(error);
      },
      close(socket) {
        if (!resolveHandshake) {
          rejectHandshake(new Error("Connection closed"));
        }
      },
    },
  });

  socket.write(handshake);

  return handshakePromise;
}
