import { parseCliArgs } from "./cli/parse";

async function getVersion(): Promise<string> {
  const pkg = await import("../package.json");
  return pkg.default.version as string;
}

async function outHelp(): Promise<void> {
  const version = await getVersion();
  console.log(`torrent-tui ${version}

Usage:
  torrent-tui                         Start the terminal UI
  torrent-tui <file.torrent>          Start the TUI and add the torrent
  torrent-tui <magnet-uri>            Start the TUI and fetch magnet metadata
  torrent-tui <file.torrent> --verify Verify local pieces and trackers
  torrent-tui <file.torrent> --handshake
                                      Connect to peers and print handshake summary
  torrent-tui <file.torrent|magnet> --download
                                      Download from the command line
  torrent-tui <file.torrent|magnet> --info
                                      Print torrent metadata without starting the TUI
  torrent-tui <file.torrent|magnet> --info --json
                                      Print torrent metadata as JSON

Magnet links:
  Supported for BitTorrent v1 btih magnets with trackers, x.pe peers, or DHT peers.
  --verify, --handshake, and --info can use a magnet after its metadata is cached.

Options:
  --help, -h                          Show this help
  --version, -v                       Print the version
  --json                              Machine-readable output for --info`);
}

async function main() {
  const command = (() => {
    try {
      return parseCliArgs(process.argv.slice(2));
    } catch (err) {
      console.log(`Error: ${err instanceof Error ? err.message : String(err)}`);
      process.exit(1);
    }
  })();

  if (command.action === "help") {
    await outHelp();
    return;
  }
  if (command.action === "version") {
    console.log(await getVersion());
    return;
  }
  // TODO: add info download info
  // TODO: add entry point for app (tui)
}

main().catch((err: unknown) => {
  if (err) return;
  process.exitCode = 1;
  console.error(`Error: ${err instanceof Error ? err.message : err}`);
});
