import { getTorrentDisplayInfo, getTorrentInfo } from "@/core/torrent.service";
import type { TorrentInfoSummary, TorrentMeta } from "@/engine/types";

type TorrentValidationResult =
  | { ok: true; value: TorrentMeta }
  | { ok: false; error: string };

export const validateTorrentMeta = (
  value: unknown,
): TorrentValidationResult => {
  if (!value || typeof value !== "object")
    return { ok: false, error: "Invalid torrent metadata: expected object" };

  const record = value as Record<string, unknown>;
  if (!Buffer.isBuffer(record.announce))
    return {
      ok: false,
      error: "Invalid torrent metadata: announce is missing",
    };
  if (!Buffer.isBuffer(record._rawInfo))
    return {
      ok: false,
      error: "Invalid torrent metadata: _rawInfo is missing",
    };

  const info = record.info as Record<string, unknown> | undefined;
  if (!info || typeof info !== "object")
    return { ok: false, error: "Invalid torrent metadata: info is missing" };
  if (typeof info.length !== "number")
    return {
      ok: false,
      error: "Invalid torrent metadata: info.length is missing",
    };
  if (typeof info["piece length"] !== "number")
    return {
      ok: false,
      error: "Invalid torrent metadata: info.piece length is missing",
    };
  if (!Buffer.isBuffer(info.pieces))
    return {
      ok: false,
      error: "Invalid torrent metadata: info.pieces is missing",
    };

  return { ok: true, value: record as TorrentMeta };
};

const assertTorrentMeta: (value: unknown) => asserts value is TorrentMeta = (
  value,
) => {
  const result = validateTorrentMeta(value);
  if (!result.ok) throw new Error(result.error);
};

export const parseTorrent = (torrentPath: string): TorrentMeta => {
  const decoded = getTorrentInfo(torrentPath) as unknown;
  assertTorrentMeta(decoded);
  return decoded as TorrentMeta;
};

// returns same union `TorrentValidationResult` without throwing
// would be helpful to show friendly error w/o crashing
export const tryParseTorrent = (
  torrentPath: string,
): TorrentValidationResult => {
  try {
    const decoded = getTorrentInfo(torrentPath) as unknown;
    return validateTorrentMeta(decoded);
  } catch (error: any) {
    return {
      ok: false,
      error: `Invalid torrent metadata: ${error.message}`,
    };
  }
};

export const getTorrentSummary = (torrentPath: string): TorrentInfoSummary =>
  getTorrentDisplayInfo(torrentPath);
