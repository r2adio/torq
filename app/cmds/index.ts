export const COMMANDS = ["decode", "info", "peers", "handshake"] as const;
export type Command = (typeof COMMANDS)[number];

import { decode, info } from "./base.cmd";
import { handshake, peers } from "./peers.cmd";

const commands = {
  decode,
  info,
  peers,
  handshake,
} as const;

export const runCLI = () => {
  const cmd = process.argv[2] as keyof typeof commands | undefined;
  if (cmd && commands[cmd]) commands[cmd]();
};
