import { decodeBencode } from "@/utils/bencode";
import { getTorrentDisplayInfo } from "@/core/torrent.service";
import { bufferReplacer } from "@/utils/buffer";

if (process.argv[2] === "decode") {
  const inputValue: string = process.argv[3]
    ? (() => {
        console.log(`Decoding input value '${process.argv[3]}'.`);
        return process.argv[3];
      })()
    : prompt("Enter a bencoded string to decode:") || "";
  try {
    const decoded = decodeBencode(Buffer.from(inputValue, "utf-8"));
    console.log("Decoded output:", JSON.stringify(decoded, bufferReplacer, 2));
  } catch (error: any) {
    console.error("Error decoding:", error.message);
  }
}

if (process.argv[2] === "info") {
  const torrentPath: string = process.argv[3]
    ? (() => {
        console.log(`Decoding torrent file at path '${process.argv[3]}'.`);
        return process.argv[3];
      })()
    : prompt("Enter the path to the torrent file:") || "";
  try {
    const info = getTorrentDisplayInfo(torrentPath);
    console.log(`Tracker URL: ${info.trackerUrl}`);
    console.log(`Length: ${info.infoLength}`);
    console.log(`Info Hash: ${info.infoHash}`);
    console.log(`Piece Length: ${info.pieceLength}`);
    console.log(`Piece Hashes:`);
    info.pieceHash.forEach((hash, index) => {
      console.log(`${index + 1}: ${hash}`);
    });
  } catch (error: any) {
    console.error("Error reading torrent file:", error.message);
  }
}
