import { engine } from "@/engine";

export const download_piece = async () => {
  if (process.argv[3] !== "-o") {
    console.error(
      "Usage: download_piece -o <output_path> <torrent_path> <piece_index>",
    );
    process.exit(1);
  }
  const outputPath: string = process.argv[4] ?? "";
  const torrentPath: string = process.argv[5] ?? "";
  const pieceIndexRaw = process.argv[6] ?? "";
  const pieceIndex: number = parseInt(pieceIndexRaw, 10);
  if (!outputPath || !torrentPath || Number.isNaN(pieceIndex)) {
    console.error(
      "Usage: download_piece -o <output_path> <torrent_path> <piece_index>",
    );
    process.exit(1);
  }
  try {
    console.log("Downloading piece index:", pieceIndex);

    console.log("Fetching peers from tracker...");
    const peers = await engine.fetchPeers(torrentPath);
    if (peers.length === 0) throw new Error("No peers available for download");

    console.log(`Found ${peers.length} peers. Attempting download...`);

    await engine.downloadPieceToFile({
      torrentPath,
      pieceIndex,
      outputPath,
      peers,
    });
    console.log("Piece downloaded and verified successfully!");
    console.log(`Piece ${pieceIndex} saved to ${outputPath}`);
  } catch (error: any) {
    console.error("Error fetching a piece:", error.message);
  }
};

export const download = async () => {
  if (process.argv[3] !== "-o") {
    console.error("Usage: download -o <output_path> <torrent_path>");
    process.exit(1);
  }

  const outputPath: string = process.argv[4] ?? "";
  const torrentPath: string = process.argv[5] ?? "";
  if (!outputPath || !torrentPath) {
    console.error("Usage: download -o <output_path> <torrent_path>");
    process.exit(1);
  }

  try {
    console.log("Fetching peers from tracker...");
    const peers = await engine.fetchPeers(torrentPath);
    if (peers.length === 0) throw new Error("No peers available for download");

    console.log(
      `Found ${peers.length} peers. Downloading pieces sequentially...`,
    );

    await engine.downloadFileToPath({ torrentPath, outputPath, peers });
    console.log(`Download complete. File saved to ${outputPath}`);
  } catch (error: any) {
    console.error("Error downloading file:", error.message);
  }
};
