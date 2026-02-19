import fs from "fs";

function detectType(bencoded: string, index: number): string {
  if (index >= bencoded.length) return "empty";

  const char = bencoded[index];
  if (char === undefined) return "empty";
  // check for bencoded integer format: i<integer>e
  if (char === "i") return "integer";
  // check for bencoded string format: <length>:<data>
  if (char >= "0" && char <= "9") return "string";
  // check for bencoded list format: l<elements>e
  if (char === "l") return "list";
  // check for bencoded dictionary format: d<key><value>e
  if (char === "d") return "dictionary";

  return "Invalid bencoded format.";
}

function decodeString(bencoded: string, index: number): [string, number] {
  const colonIndex = bencoded.indexOf(":", index);
  if (colonIndex === -1)
    throw new Error("Invalid bencoded string format: missing colon");
  const lenStr = bencoded.substring(index, colonIndex);
  const length = parseInt(lenStr, 10);
  if (isNaN(length) || length < 0)
    throw new Error("Invalid bencoded string format: invalid length");
  const start = colonIndex + 1;
  const data = bencoded.substring(start, start + length);
  if (data.length !== length)
    throw new Error("Invalid bencoded string format: data length mismatch");
  return [data, start + length];
}
function decodeInteger(bencoded: string, index: number): [number, number] {
  if (bencoded[index] !== "i")
    throw new Error("Invalid bencoded integer format: missing 'i' prefix");
  const endIndex = bencoded.indexOf("e", index);
  if (endIndex === -1)
    throw new Error("Invalid bencoded integer format: missing 'e' suffix");
  const intStr = bencoded.substring(index + 1, endIndex);
  const value = parseInt(intStr, 10);
  if (isNaN(value))
    throw new Error("Invalid bencoded integer format: invalid number");
  return [value, endIndex + 1];
}
function decodeList(bencoded: string, index: number): [any[], number] {
  if (bencoded[index] !== "l")
    throw new Error("Invalid bencoded list format: missing 'l' prefix");
  const list: any[] = [];
  let currentIndex = index + 1;
  while (currentIndex < bencoded.length && bencoded[currentIndex] !== "e") {
    const [element, nextIndex] = decodeNext(bencoded, currentIndex);
    list.push(element);
    currentIndex = nextIndex;
  }
  if (currentIndex >= bencoded.length || bencoded[currentIndex] !== "e")
    throw new Error("Invalid bencoded list format: missing 'e' suffix");
  return [list, currentIndex + 1];
}
function decodeDictionary(
  bencoded: string,
  index: number,
): [Record<string, any>, number] {
  if (bencoded[index] !== "d")
    throw new Error("Invalid bencoded dictionary format: missing 'd' prefix");
  const dict: Record<string, any> = {};
  let currentIndex = index + 1;
  while (currentIndex < bencoded.length && bencoded[currentIndex] !== "e") {
    const [key, nextKeyIndex] = decodeString(bencoded, currentIndex);
    const [value, nextValueIndex] = decodeNext(bencoded, nextKeyIndex);
    dict[key] = value;
    currentIndex = nextValueIndex;
  }
  if (currentIndex >= bencoded.length || bencoded[currentIndex] !== "e")
    throw new Error("Invalid bencoded dictionary format: missing 'e' suffix");
  return [dict, currentIndex + 1];
}

function decodeBencode(bencoded: string): any {
  const [result, nextIndex] = decodeNext(bencoded, 0);
  if (nextIndex !== bencoded.length) {
    throw new Error(
      `Unexpected extra data after valid bencoded value at index ${nextIndex}`,
    );
    // const remaining = decodeNext(bencoded, nextIndex)[0];
    // return { result, remaining };
  }
  return result;
}

function decodeNext(bencoded: string, index: number): [any, number] {
  const type = detectType(bencoded, index);
  switch (type) {
    case "integer":
      return decodeInteger(bencoded, index);
    case "string":
      return decodeString(bencoded, index);
    case "list":
      return decodeList(bencoded, index);
    case "dictionary":
      return decodeDictionary(bencoded, index);
    default:
      throw new Error("Invalid bencoded format.");
  }
}

if (process.argv[2] === "decode") {
const inputValue: string = process.argv[3] || "d4:spaml1:a1:bee";
  try {
    const decoded = decodeBencode(inputValue);
    console.log(`Decoded ${typeof decoded}:`, decoded);
  } catch (error: any) {
    console.error("Error decoding:", error.message);
  }
} else {
  // console.log(`The default input value is '${inputValue}'.`);
  // console.log("Decoded string:", decodeBencode(inputValue));
}

// helper function to convert Uint8Array (Buffer) to string
const bytesToString = (b: Uint8Array): string =>
  Buffer.from(b).toString("utf-8");

if (process.argv[2] === "info") {
  if (process.argv[3]) {
    const torrentPath = process.argv[3];
    try {
      const torrentData = fs.readFileSync(torrentPath);
      const torrentString = bytesToString(torrentData);
      const decodedTorrent = decodeBencode(torrentString);
      console.log("Decoded torrent info:", decodedTorrent);
    } catch (error: any) {
      console.error("Error reading or decoding torrent file:", error.message);
    }
  } else {
    // TODO: user prompt for torrent file path
  }
}
