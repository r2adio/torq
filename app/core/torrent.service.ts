import fs from "fs";
import { decodeBencode } from "@/utils/bencode";
import { bytesToString } from "@/utils/buffer";

export function getTorrentInfo(torrentPath: string): any {
  const torrentData = fs.readFileSync(torrentPath);
  const torrentString = bytesToString(torrentData);
  return decodeBencode(torrentString);
}

export function getTorrentDisplayInfo(torrentPath: string): {
  trackerUrl: string;
  length: number;
} {
  const decoded = getTorrentInfo(torrentPath);
  return {
    trackerUrl: decoded.announce,
    length: decoded.info.length,
  };
}
