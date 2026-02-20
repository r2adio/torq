export function detectType(bencoded: Buffer, index: number): string {
  if (index >= bencoded.length) return "empty";

  const byte = bencoded[index];
  if (byte === undefined) return "empty";
  const char = String.fromCharCode(byte);
  // check for bencoded integer format: i<integer>e
  if (char === "i") return "integer";
  // check for bencoded string format: <length>:<data>
  if (char >= "0" && char <= "9") return "string";
  // check for bencoded list format: l<elements>e
  if (char === "l") return "list";
  // check for bencoded dictionary format: d<key><value>e
  if (char === "d") return "dictionary";

  throw new Error(
    `Invalid bencoded format at index ${index}: unexpected character '${char}'`,
  );
}

export function decodeString(buffer: Buffer, index: number): [Buffer, number] {
  const colonIndex = buffer.indexOf(0x3a /*:*/, index);
  if (colonIndex === -1)
    throw new Error("Invalid bencoded string format: missing colon");
  const lenStr = buffer.toString("ascii", index, colonIndex);
  const length = parseInt(lenStr, 10);
  if (isNaN(length) || length < 0)
    throw new Error("Invalid bencoded string format: invalid length");
  const start = colonIndex + 1;
  const end = start + length;
  if (end > buffer.length)
    throw new Error(
      "Invalid bencoded string format: data exceeds buffer length",
    );
  return [buffer.subarray(start, end), end];
}

export function decodeInteger(buffer: Buffer, index: number): [number, number] {
  if (buffer[index] !== 0x69 /*i*/)
    throw new Error("Invalid bencoded integer format: missing 'i' prefix");
  const endIndex = buffer.indexOf(0x65 /*e*/, index);
  if (endIndex === -1)
    throw new Error("Invalid bencoded integer format: missing 'e' suffix");
  const intStr = buffer.toString("ascii", index + 1, endIndex);
  const value = parseInt(intStr, 10);
  if (isNaN(value))
    throw new Error("Invalid bencoded integer format: invalid number");
  return [value, endIndex + 1];
}

export function decodeList(buffer: Buffer, index: number): [any[], number] {
  if (index >= buffer.length || buffer[index] !== 0x6c)
    throw new Error("Invalid bencoded list format: missing 'l' prefix");
  const list: any[] = [];
  let currentIndex = index + 1;
  while (currentIndex < buffer.length && buffer[currentIndex] !== 0x65) {
    const [element, nextIndex] = decodeNext(buffer, currentIndex);
    list.push(element);
    currentIndex = nextIndex;
  }
  if (currentIndex >= buffer.length || buffer[currentIndex] !== 0x65)
    throw new Error("Invalid bencoded list format: missing 'e' suffix");
  return [list, currentIndex + 1];
}

export function decodeDictionary(
  buffer: Buffer,
  index: number,
): [Record<string, any>, number] {
  if (buffer[index] !== 0x64)
    throw new Error("Invalid bencoded dictionary format: missing 'd' prefix");
  const dict: Record<string, any> = {};
  let currentIndex = index + 1;
  while (currentIndex < buffer.length && buffer[currentIndex] !== 0x65) {
    const [rawKey, nextKeyIndex] = decodeString(buffer, currentIndex);
    const key = rawKey.toString("utf-8");
    const valueStart = nextKeyIndex;
    const [value, nextValueIndex] = decodeNext(buffer, nextKeyIndex);
    const valueEnd = nextValueIndex;
    dict[key] = value;
    if (key === "info" && value !== null && typeof value === "object") {
      dict._rawInfo = buffer.subarray(valueStart, valueEnd);
    }
    currentIndex = nextValueIndex;
  }
  if (currentIndex >= buffer.length || buffer[currentIndex] !== 0x65)
    throw new Error("Invalid bencoded dictionary format: missing 'e' suffix");
  return [dict, currentIndex + 1];
}

export function decodeBencode(bencoded: Buffer): any {
  const [result, nextIndex] = decodeNext(bencoded, 0);
  if (nextIndex !== bencoded.length) {
    throw new Error(
      `Unexpected extra data after valid bencoded value at index ${nextIndex}`,
    );
  }
  return result;
}

export function decodeNext(bencoded: Buffer, index: number): [any, number] {
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
