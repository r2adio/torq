import { COMMANDS } from "@/cmds";

const argv = process.argv;
const scriptIndex = argv.findIndex(
  (arg) =>
    arg.endsWith("app/main.ts") ||
    arg.endsWith("app/main.js") ||
    arg.endsWith("app/main.mjs"),
);
const argsStart = scriptIndex >= 0 ? scriptIndex + 1 : 2;
const args = argv.slice(argsStart);

process.argv = [argv[0] ?? "", argv[1] ?? "", ...args];

if (args.length > 0) {
  const command = args[0] as (typeof COMMANDS)[number];
  if (COMMANDS.includes(command)) {
    import("@/cmds")
      .then(({ runCLI }) => runCLI())
      .catch((err) => {
        console.error("Failed to run command:", err);
        process.exit(1);
      });
  } else {
    console.log(`Unknown command: ${command}`);
    console.log("Available commands:");
    COMMANDS.forEach((cmd) => {
      console.log(`- ${cmd}`);
    });
    process.exit(1);
  }
} else {
  import("@/ui");
  // import("@/ui").catch((err) => {
  // console.error("Failed to run TUI:", err);
  // process.exit(1);
  // }
}
