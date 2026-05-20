import { getTorrentDisplayInfo } from "@/core/torrent.service";
import { decodeBencode } from "@/utils/bencode";
import { bufferReplacer } from "@/utils/buffer";

export const decode = () => {
  const inputValue: string = process.argv[3] ?? "";
  if (!inputValue) {
    console.error("Usage: decode <bencoded_string>");
    process.exit(1);
  }
  try {
    const decoded = decodeBencode(Buffer.from(inputValue, "utf-8"));
    console.log("Decoded output:", JSON.stringify(decoded, bufferReplacer, 2));
  } catch (error: any) {
    console.error("Error decoding:", error.message);
  }
};

export const info = () => {
  const torrentPath: string = process.argv[3] ?? "";
  if (!torrentPath) {
    console.error("Usage: info <torrent_path>");
    process.exit(1);
  }
  try {
    const info = getTorrentDisplayInfo(torrentPath);
    console.log(`Tracker URL: ${info.trackerUrl}`);
    console.log(`Length: ${info.infoLength}`);
    console.log(`Info Hash: ${info.infoHash}`);
    console.log(`Piece Length: ${info.pieceLength}`);
    console.log(`Piece Hashes:`);
    info.pieceHash.forEach((hash, index) => {
      console.log(`  ${index + 1}: ${hash}`);
    });
  } catch (error: any) {
    console.error("Error reading torrent file:", error.message);
  }
};
