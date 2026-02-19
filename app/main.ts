import { decodeBencode } from "@/utils/bencode";
import { getTorrentInfo } from "@/core/torrentService";

if (process.argv[2] === "decode") {
  const inputValue: string = process.argv[3]
    ? (() => {
        console.log(`Decoding input value '${process.argv[3]}'.`);
        return process.argv[3];
      })()
    : prompt("Enter a bencoded string to decode:") || "";
  try {
    const decoded = decodeBencode(inputValue);
    console.log(`Decoded ${typeof decoded}:`, JSON.stringify(decoded, null, 2));
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
    const decodedTorrent = getTorrentInfo(torrentPath);
    console.log(
      "Decoded torrent file:",
      JSON.stringify(decodedTorrent, null, 2),
    );
  } catch (error: any) {
    console.error("Error reading torrent file:", error.message);
  }
}
