import { engine } from "@/engine";

export const peers = async () => {
  const torrentPath: string = process.argv[3] ?? "";
  if (!torrentPath) {
    console.error("Usage: peers <torrent_path>");
    process.exit(1);
  }
  try {
    const peerList = await engine.fetchPeers(torrentPath);
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
  const torrentPath: string = process.argv[3] ?? "";
  const peerAddress: string = process.argv[4] ?? "";
  if (!torrentPath || !peerAddress) {
    console.error("Usage: handshake <torrent_path> <peer_ip:peer_port>");
    process.exit(1);
  }
  try {
    const peerId = await engine.handshakeWithPeer(torrentPath, peerAddress);
    console.log(`Peer ID: ${peerId}`);
  } catch (error: any) {
    console.error("Error during handshake:", error.message);
  }
};
