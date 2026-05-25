import type {
  FileDownloadOptions,
  PieceDownloadOptions,
  TorrentInfoSummary,
  TorrentMeta,
} from "@/engine/types";
import { parseTorrent, getTorrentSummary } from "@/engine/torrent";
import { fetchPeers, handshakeWithPeer } from "@/engine/peers";
import {
  downloadPiece,
  downloadPieceToFile,
  downloadFileToPath,
} from "@/engine/download";

export type Engine = {
  parseTorrent: (torrentPath: string) => TorrentMeta;
  getTorrentSummary: (torrentPath: string) => TorrentInfoSummary;
  fetchPeers: (torrentPath: string) => Promise<string[]>;
  handshakeWithPeer: (
    torrentPath: string,
    peerAddress: string,
  ) => Promise<string>;
  downloadPiece: (options: PieceDownloadOptions) => Promise<Buffer>;
  downloadPieceToFile: (
    options: PieceDownloadOptions & { outputPath: string },
  ) => Promise<void>;
  downloadFileToPath: (options: FileDownloadOptions) => Promise<void>;
};

export const engine: Engine = {
  parseTorrent,
  getTorrentSummary,
  fetchPeers,
  handshakeWithPeer,
  downloadPiece,
  downloadPieceToFile,
  downloadFileToPath,
};
