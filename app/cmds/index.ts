export const COMMANDS = [
  "info",
  "peers",
  "decode",
  "download",
  "handshake",
  "download_piece",
] as const;

import { decode, info } from "./base.cmd";
import { handshake, peers } from "./peers.cmd";
import { download, download_piece } from "./download.cmd";

const commands = {
  decode,
  info,
  peers,
  handshake,
  download_piece,
  download,
} as const;

export const runCLI = () => {
  const cmd = process.argv[2] as keyof typeof commands | undefined;
  if (cmd && commands[cmd]) commands[cmd]();
};
