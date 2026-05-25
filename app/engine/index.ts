import type {
  FileDownloadOptions,
  PieceChunk,
  PieceDownloadOptions,
  TorrentInfoSummary,
  TorrentMeta,
} from "@/engine/types";
import { parseTorrent, getTorrentSummary } from "@/engine/torrent";
import { fetchPeers, handshakeWithPeer } from "@/engine/peers";
import { downloadPiece, downloadFilePieces } from "@/engine/download";

export type Engine = {
  parseTorrent: (torrentPath: string) => TorrentMeta;
  getTorrentSummary: (torrentPath: string) => TorrentInfoSummary;
  fetchPeers: (torrentPath: string) => Promise<string[]>;
  handshakeWithPeer: (
    torrentPath: string,
    peerAddress: string,
  ) => Promise<string>;
  downloadPiece: (options: PieceDownloadOptions) => Promise<Buffer>;
  downloadFilePieces: (
    options: FileDownloadOptions,
  ) => AsyncGenerator<PieceChunk, void>;
};

export const engine: Engine = {
  parseTorrent,
  getTorrentSummary,
  fetchPeers,
  handshakeWithPeer,
  downloadPiece,
  downloadFilePieces,
};
