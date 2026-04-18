import { getPeers, performHandshake } from "@/core/peer.service";

export const peers = async () => {
  const torrentPath: string =
    process.argv[3] ?? prompt("Enter the path to the torrent file:") ?? "";
  try {
    const peerList = await getPeers(torrentPath);
    if (!peerList.length) {
      console.log("No peers found in tracker response.");
      return;
    }
    peerList.forEach((peer) => {
      console.log(peer);
    });
  } catch (error: any) {
    console.error("Error fetching peers:", error.message);
  }
};

export const handshake = async () => {
  const torrentPath: string =
    process.argv[3] ?? prompt("Enter the path to the torrent file:") ?? "";
  const peerAddress: string =
    process.argv[4] ?? prompt("Enter the peer address (ip:port):") ?? "";
  try {
    const peerId = await performHandshake(torrentPath, peerAddress);
    console.log(`Peer ID: ${peerId}`);
  } catch (error: any) {
    console.error("Error during handshake:", error.message);
  }
};
