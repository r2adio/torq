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
  if (colonIndex === -1) {
    throw new Error("Invalid bencoded string format: missing colon");
  }
  const lenStr = bencoded.substring(index, colonIndex);
  const length = parseInt(lenStr, 10);
  if (isNaN(length) || length < 0) {
    throw new Error("Invalid bencoded string format: invalid length");
  }
  const start = colonIndex + 1;
  const data = bencoded.substring(start, start + length);
  if (data.length !== length) {
    throw new Error("Invalid bencoded string format: data length mismatch");
  }
  return [data, start + length];
}
function decodeInteger(bencoded: string, index: number): [number, number] {
  if (bencoded[index] !== "i") {
    throw new Error("Invalid bencoded integer format: missing 'i' prefix");
  }
  const endIndex = bencoded.indexOf("e", index);
  if (endIndex === -1) {
    throw new Error("Invalid bencoded integer format: missing 'e' suffix");
  }
  const intStr = bencoded.substring(index + 1, endIndex);
  const value = parseInt(intStr, 10);
  if (isNaN(value)) {
    throw new Error("Invalid bencoded integer format: invalid number");
  }
  return [value, endIndex + 1];
}
function decodeList(bencoded: string, index: number): [any[], number] {}
function decodeDictionary(
  bencoded: string,
  index: number,
): [Record<string, any>, number] {}

function decodeBencode(bencoded: string): any {
  const [result, nextIndex] = decodeNext(bencoded, 0);
  if (nextIndex !== bencoded.length) {
    throw new Error(
      `Unexpected extra data after valid bencoded string at index ${nextIndex}`,
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

const inputValue: string = process.argv[3] || "4:spam";
if (process.argv[2] === "decode") {
  try {
    const decoded = decodeBencode(inputValue);
    console.log("Decoded string:", decoded);
  } catch (error: any) {
    console.error("Error decoding bencoded string:", error.message);
  }
} else {
  console.log(`The default input value is '${inputValue}'.`);
  console.log("Decoded string:", decodeBencode(inputValue));
}
