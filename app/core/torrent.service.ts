import fs from "fs";
import { decodeBencode } from "@/utils/bencode";
import { computeInfoHash } from "@/utils/buffer";

export function getTorrentInfo(torrentPath: string): any {
  const torrentBuffer = fs.readFileSync(torrentPath);
  // decodeBencode reads buffer not string, so we don't need to convert it to string first
  return decodeBencode(torrentBuffer);
}

export function getTorrentDisplayInfo(torrentPath: string): {
  trackerUrl: string;
  infoLength: number;
  infoHash: string;
  pieceLength: number;
  pieceHash: string[];
} {
  const decoded = getTorrentInfo(torrentPath);
  const infoHash = computeInfoHash(decoded._rawInfo);

  const pieces = decoded.info.pieces as Buffer;
  if (pieces.length % 20 !== 0)
    throw new Error("Invalid pieces length in torrent file.");
  const pieceHash: string[] = [];
  for (let i = 0; i < pieces.length; i += 20)
    pieceHash.push(pieces.subarray(i, i + 20).toString("hex"));

  return {
    trackerUrl: decoded.announce.toString("utf-8"),
    infoLength: decoded.info.length,
    infoHash: infoHash.toString(),
    pieceLength: decoded.info["piece length"],
    pieceHash, // TODO: add limit to only show first n pieces
  };
}
