import { getTorrentDisplayInfo, getTorrentInfo } from "@/core/torrent.service";
import type { TorrentInfoSummary, TorrentMeta } from "@/engine/types";

export const parseTorrent = (torrentPath: string): TorrentMeta =>
  getTorrentInfo(torrentPath) as TorrentMeta;

export const getTorrentSummary = (torrentPath: string): TorrentInfoSummary =>
  getTorrentDisplayInfo(torrentPath);
