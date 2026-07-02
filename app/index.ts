import { existsSync } from "node:fs";
import { parseCliArgs } from "./cli/parse";

async function getVersion(): Promise<string> {
  const pkg = await import("../package.json");
  return pkg.default.version as string;
}

async function printHelp(): Promise<void> {
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

function validateTorrentArg(arg: string): string {
  if (!arg.toLowerCase().endsWith(".torrent")) {
    console.error(`Error: '${arg}' is not a .torrent file`);
    process.exit(1);
  }
  if (!existsSync(arg)) {
    console.error();
    process.exit(1);
  }
  return arg;
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
    await printHelp();
    return;
  }
  if (command.action === "version") {
    console.log(await getVersion());
    return;
  }
  // TODO: add verify, handshake, download, info actions
  if (command.input) {
    const torrentPath = validateTorrentArg(command.input);
    if (command.action === "verify") {
      return;
    }
    if (command.action === "handshake") {
      return;
    }
    if (command.action === "download") {
      return;
    }
    if (command.action === "info") {
      return;
    }
  }
  // TODO: add entry point for app (tui)
}

main().catch((err: unknown) => {
  if (err) return;
  console.error(`Error: ${err instanceof Error ? err.message : err}`);
  process.exitCode = 1;
});
