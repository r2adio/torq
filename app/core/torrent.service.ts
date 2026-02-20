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
  length: number;
  infoHash: string;
} {
  const decoded = getTorrentInfo(torrentPath);
  const infoHash = computeInfoHash(decoded._rawInfo);
  return {
    trackerUrl: decoded.announce.toString("utf-8"),
    length: decoded.info.length,
    infoHash: infoHash.toString(),
  };
}
