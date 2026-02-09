import * as fs from "fs";
import bencode from "bencode";

// reading torrent files w/o decoding
// const data = fs.readFileSync("puppy.torrent", "utf-8");

// we don't decode as 'utf-8' here because torrent files contain raw binary
// data (like info hashes) that would be corrupted if forced into a string.
const data = bencode.decode(fs.readFileSync("sample.torrent"));

// helper function to convert Uint8Array (Buffer) to string
const bytesToString = (b: Uint8Array): string =>
  Buffer.from(b).toString("utf-8");

// listing files in the torrent: multi-file vs single-file
if (data.info.files) {
  data.info.files.forEach((file: { path: Buffer[]; length: number }) => {
    // path is an array of Buffers, map each buffer to a string
    const pathString = file.path
      .map((p: Uint8Array) => bytesToString(p))
      .join("/");
    console.log(`File: ${pathString} (${file.length} bytes)`);
  });
} else {
  // name is a Buffer
  console.log(
    `File: ${bytesToString(data.info.name)} (${data.info.length} bytes)`,
  );
}

// metadata fields of torrent file:
console.log(`Announce URL: ${bytesToString(data.announce)}`);
console.log(
  "Comment:",
  data.comment ? data.comment.toString("utf-8") : "No comment",
);
console.log(`Name: ${bytesToString(data.info.name)}`);
console.log("Piece Length:", data.info["piece length"]);
console.log("Pieces:", data.info.pieces.length / 20, "pieces");
