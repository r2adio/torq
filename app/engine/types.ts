export type TorrentInfo = {
  length: number;
  "piece length": number;
  pieces: Buffer;
  [key: string]: unknown;
};

export type TorrentMeta = {
  announce: Buffer;
  info: TorrentInfo;
  _rawInfo: Buffer;
  [key: string]: unknown;
};

export type TorrentInfoSummary = {
  trackerUrl: string;
  infoLength: number;
  infoHash: string;
  pieceLength: number;
  pieceHash: string[];
};

export type PieceDownloadOptions = {
  torrentPath: string;
  pieceIndex: number;
  peers?: string[];
};

export type FileDownloadOptions = {
  torrentPath: string;
  outputPath: string;
  peers?: string[];
};
