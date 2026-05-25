import { getPeers, performHandshake } from "@/core/peer.service";

export const fetchPeers = (torrentPath: string): Promise<string[]> =>
  getPeers(torrentPath);

export const handshakeWithPeer = (
  torrentPath: string,
  peerAddress: string,
): Promise<string> => performHandshake(torrentPath, peerAddress);
