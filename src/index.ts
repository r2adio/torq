import * as fs from "fs";
import bencode from "bencode";

// reading torrent files w/o decoding
// const data = fs.readFileSync("puppy.torrent", "utf-8");

// we don't decode as 'utf-8' here because torrent files contain raw binary
// data (like info hashes) that would be corrupted if forced into a string.
const data = bencode.decode(fs.readFileSync("puppy.torrent"));

// manually convert only the fields we know are text
console.log(data.announce.toString("utf-8"));
