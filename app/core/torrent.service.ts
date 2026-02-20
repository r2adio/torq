import fs from "fs";
import { decodeBencode } from "@/utils/bencode";
import { bytesToString } from "@/utils/buffer";
// Torrent Info: {
//   "announce": "http://bittorrent-test-tracker.codecrafters.io/announce",
//   "created by": "mktorrent 1.1",
//   "info": {
//     "length": 92063,
//     "name": "sample.txt",
//     "piece length": 32768,
//     "pieces": "�v�z*����k\u0013g&�\u000f��\u0003\u0002-n\"u�\u0004�vfVsn��\u0010�R\u0004��5�\r�z\u0002\u0013�\u0019���\tr'�����\u0017"
//   }
// }

export function getTorrentInfo(torrentPath: string): any {
  const torrentBuffer = fs.readFileSync(torrentPath);
  // decodeBencode reads buffer not string, so we don't need to convert it to string first
  return decodeBencode(torrentBuffer);
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
