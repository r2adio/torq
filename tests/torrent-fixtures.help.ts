import { TorrentMetadata } from "@/torrent/metadata.ts";
import { type BencodeValue, decode, encode } from "@/torrent/parser.ts";
import { bytes, pieceHashBytes } from "./bytes.help.ts";

export interface TorrentFixture {
  raw: Uint8Array;
  metadata: TorrentMetadata;
  content: Uint8Array;
  info: { [key: string]: BencodeValue };
}

export function metadataFromRaw(raw: Uint8Array): TorrentMetadata {
  const decoded = decode(raw);
  if (
    typeof decoded !== "object" ||
    decoded === null ||
    Array.isArray(decoded) ||
    decoded instanceof Uint8Array
  ) {
    throw new Error("Fixture did not decode to a torrent dictionary");
  }
  return new TorrentMetadata(decoded as { [key: string]: BencodeValue }, raw);
}

export function singleFileTorrentFixture(
  options: {
    name?: string;
    content?: Uint8Array;
    pieceLength?: number;
    announce?: string;
    announceList?: string[][];
    nodes?: Array<[string, number]>;
    private?: boolean;
    webSeeds?: string[];
  } = {},
): TorrentFixture {
  const name = options.name ?? "sample.bin";
  const content = options.content ?? bytes("abcdefghijkl");
  const pieceLength = options.pieceLength ?? 4;
  const info: { [key: string]: BencodeValue } = {
    length: content.length,
    name,
    "piece length": pieceLength,
    pieces: pieceHashBytes(content, pieceLength),
  };
  const torrent = buildTorrentDictionary(info, options);
  const raw = encode(torrent);
  return { raw, metadata: metadataFromRaw(raw), content, info };
}

function buildTorrentDictionary(
  info: { [key: string]: BencodeValue },
  options: {
    announce?: string;
    announceList?: string[][];
    nodes?: Array<[string, number]>;
    private?: boolean;
    webSeeds?: string[];
  },
): { [key: string]: BencodeValue } {
  const torrent: { [key: string]: BencodeValue } = {
    announce: options.announce ?? "http://tracker.example/announce",
    info,
  };
  if (options.announceList) torrent["announce-list"] = options.announceList;
  if (options.nodes) torrent.nodes = options.nodes;
  if (options.private) info.private = 1;
  if (options.webSeeds) {
    if (options.webSeeds.length === 1 && options.webSeeds[0]) {
      torrent["url-list"] = options.webSeeds[0];
    } else {
      torrent["url-list"] = options.webSeeds;
    }
  }
  return torrent;
}
