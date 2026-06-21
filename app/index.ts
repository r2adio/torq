async function getVersion(): Promise<string> {
  const pkg = await import("../package.json");
  return pkg.default.version as string;
}

async function main() {
  const command = (() => {
    try {
      return parseCliArgs(process.argv.slice(2)); // TODO: add cli parser
    } catch (err) {
      console.log(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  })();

  if (command.action === "version") {
    console.log(await getVersion());
    return;
  }
  // TODO: add info download info help
  // TODO: add entry point for app (tui)
}

main().catch((err: unknown) => {
  if (err) return;
  process.exitCode = 1;
  console.error(`Error: ${err instanceof Error ? err.message : err}`);
});
