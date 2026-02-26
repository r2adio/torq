import { performHandshake } from "@/core/peer.service";
import { getTorrentDisplayInfo } from "@/core/torrent.service";
import { decodeBencode } from "@/utils/bencode";

export const peers = async () => {
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
};

export const handshake = async () => {
  const torrentPath: string = process.argv[3]!;
  const peerAddress: string = process.argv[4]!;

  try {
    const peerId = await performHandshake(torrentPath, peerAddress);
    console.log(`Peer ID: ${peerId}`);
  } catch (error: any) {
    console.error("Error during handshake:", error.message);
  }
};
