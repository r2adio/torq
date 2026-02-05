import * as fs from "fs";
import bencode from "bencode";

// reading torrent files w/o decoding
// const data = fs.readFileSync("puppy.torrent", "utf-8");

// we don't decode as 'utf-8' here because torrent files contain raw binary
// data (like info hashes) that would be corrupted if forced into a string.
const data = bencode.decode(fs.readFileSync("puppy.torrent"));

// listing files in the torrent: multi-file vs single-file
if (data.info.files) {
  data.info.files.forEach((file: { path: Buffer[]; length: number }) => {
    // path is an array of Buffers, map each buffer to a string
    const pathString = file.path
      .map((p: Buffer) => p.toString("utf-8"))
      .join("/");
    console.log(`File: ${pathString} (${file.length} bytes)`);
  });
} else {
  // name is a Buffer
  console.log(
    `File: ${data.info.name.toString("utf-8")} (${data.info.length} bytes)`,
  );
}

// metadata fields of torrent file:
console.log("Announce URL:", data.announce.toString("utf-8"));
console.log(
  "Comment:",
  data.comment ? data.comment.toString("utf-8") : "No comment",
);
console.log("Name:", data.info.name.toString("utf-8"));
console.log("Piece Length:", data.info["piece length"]);
console.log("Pieces:", data.info.pieces.length / 20, "pieces");
