const validCommand = ["decode", "info", "peers", "handshake"].includes(
  process.argv[2] || "",
);
if (validCommand) {
  import("@/cmds").then(({ runCLI }) => runCLI());
} else if (process.argv[2]) {
  console.log(`Unknown command: ${process.argv[2]}`);
  console.log("Available commands:");
  ["decode", "info", "peers", "handshake"].forEach((cmd) =>
    console.log(`- ${cmd}`),
  );
} else {
  // import("@/tui").then(({ runTUI }) => runTUI());
}
