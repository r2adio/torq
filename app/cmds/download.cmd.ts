export const download_piece = async () => {
  if (process.argv[3] !== "-o")
    return console.error(
      "Usage: download_piece -o <output_path> <torrent_path> <piece_index>",
    );
  const outputPath: string =
    process.argv[4] ??
    prompt("Enter the output path for the downloaded piece:") ??
    "";
  const torrentPath: string =
    process.argv[5] ?? prompt("Enter the path to the torrent file:") ?? "";
  const pieceIndex: number = parseInt(
    process.argv[6] ?? prompt("Enter the piece index to download:") ?? "",
    10,
  );
  try {
    console.log("Downloading piece index:", pieceIndex);
  } catch (error: any) {
    console.error("Error fetching a piece:", error.message);
  }
};

export const download = async () => {};
