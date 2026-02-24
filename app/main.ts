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

if (process.argv[2] === "peers") {
  const torrentPath: string = process.argv[3]
    ? (() => {
        console.log(`Decoding torrent file at path '${process.argv[3]}'.`);
        return process.argv[3];
      })()
    : prompt("Enter the path to the torrent file:") || "";
  const info = getTorrentDisplayInfo(torrentPath);
  // convert infoHash(40 char) to raw 20 bytes, and percent-encode each byte
  const rawInfoHash = Buffer.from(info.infoHash, "hex");
  const encodedInfoHash = Array.from(rawInfoHash)
    .map((b) => `%${b.toString(16).padStart(2, "0")}`)
    .join("");

  // peer_id: 20 bytes, format: -<client(2)><version(2)><subversion(2)><random(14)>
  // INFO: -TR2820-123456789012 = Transmission v2.8.20
  const url = `${info.trackerUrl}?info_hash=${encodedInfoHash}&peer_id=-TR2820-123456789012&port=6881&uploaded=0&downloaded=0&left=${info.infoLength}&compact=1`;
  const res = await fetch(url);
  const responseBuffer = await res.arrayBuffer();
  const response = decodeBencode(Buffer.from(responseBuffer)); // decoede the tracker response
  // console.log(url);
  // console.log(response);
  // console.log(res);

  if (response["failure reason"]) {
    console.log(`Tracker error: ${response["failure reason"]}`);
  } else if (response.peers && Buffer.isBuffer(response.peers)) {
    // compact peer list: 6 bytes/peer (ip -> 4, port -> 2)
    const peersBuffer: Buffer = response.peers;
    for (let i = 0; i < peersBuffer.length; i += 6) {
      const ip = `${peersBuffer[i]}.${peersBuffer[i + 1]}.${peersBuffer[i + 2]}.${peersBuffer[i + 3]}`;
      const port = (peersBuffer[i + 4]! << 8) | peersBuffer[i + 5]!;
      console.log(`${ip}:${port}`);
    }
  } else {
    console.log("No peers found in tracker response.");
  }
}
