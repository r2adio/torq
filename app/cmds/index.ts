import { decode, info } from "./decode";

const commands = {
  decode,
  info,
} as const;

export const runCLI = () => {
  const cmd = process.argv[2] as keyof typeof commands | undefined;
  if (cmd && commands[cmd]) {
    commands[cmd]();
  } else {
    console.log("Available commands:");
    Object.keys(commands).forEach((cmd) => console.log(`- ${cmd}`));
  }
};
