import type {
  FileDownloadOptions,
  PieceChunk,
  PieceDownloadOptions,
  TorrentInfoSummary,
  TorrentMeta,
} from "@/engine/types";
import {
  parseTorrent,
  getTorrentSummary,
  tryParseTorrent,
  validateTorrentMeta,
} from "@/engine/torrent";
import { fetchPeers, handshakeWithPeer } from "@/engine/peers";
import { downloadPiece, downloadFilePieces } from "@/engine/download";

export type Engine = {
  parseTorrent: (torrentPath: string) => TorrentMeta;
  tryParseTorrent: (torrentPath: string) =>
    | { ok: true; value: TorrentMeta }
    | { ok: false; error: string };
  validateTorrentMeta: (value: unknown) =>
    | { ok: true; value: TorrentMeta }
    | { ok: false; error: string };
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
  tryParseTorrent,
  validateTorrentMeta,
  getTorrentSummary,
  fetchPeers,
  handshakeWithPeer,
  downloadPiece,
  downloadFilePieces,
};
