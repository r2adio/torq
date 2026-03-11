import { COMMANDS } from "@/cmds";

const isBunRuntime = process.argv[0]?.includes("bun") ?? true;
const args = process.argv.slice(isBunRuntime ? 2 : 1);

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
    COMMANDS.forEach((cmd) => console.log(`- ${cmd}`));
    process.exit(1);
  }
} else {
  import("@/ui").catch((err) => {
    console.error("Failed to run TUI:", err);
    process.exit(1);
  });
}
