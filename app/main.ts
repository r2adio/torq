import { COMMANDS, type Command } from "@/cmds";
const command = process.argv[2];

if (COMMANDS.includes(command as Command)) {
  import("@/cmds")
    .then(({ runCLI }) => runCLI())
    .catch((err) => {
      console.error("Failed to run command:", err);
      process.exit(1);
    });
} else if (command) {
  console.log(`Unknown command: ${command}`);
  console.log("Available commands:");
  COMMANDS.forEach((cmd) => console.log(`- ${cmd}`));
  process.exit(1);
} else {
  // import("@/tui").then(({ runTUI }) => runTUI());
}
