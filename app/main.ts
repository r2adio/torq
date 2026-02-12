function decodeBencode(bencoded: string): string[] | number {
  const result: string[] = [];
  let index = 0;
  while (index < bencoded.length) {
    const remaining = bencoded.slice(index);
    // bencoded string format is <length>:<data>
    if (remaining[0] && remaining[0] >= "0" && remaining[0] <= "9") {
      const colonPos = bencoded.indexOf(":", index);
      if (colonPos === -1) {
        throw new Error("Invalid bencoded string: missing ':'");
      }
      const len = parseInt(bencoded.slice(index, colonPos), 10);
      const start = colonPos + 1;
      const end = start + len;
      const data = bencoded.slice(start, end);
      result.push(data);
      index = end; // move past the string

      // bencoded integer format is i<integer>e
    } else if (remaining[0] === "i") {
      const endPos = bencoded.indexOf("e", index);
      if (endPos === -1) {
        throw new Error("Invalid bencoded string: missing 'e' for integer");
      }
      const numStr = bencoded.slice(index + 1, endPos);
      const num = parseInt(numStr, 10);
      if (isNaN(num)) {
        throw new Error(`Invalid integer value: '${numStr}'`);
      }
      return num; // return the integer value
    } else {
      throw new Error(
        `Invalid bencoded string: unexpected character '${remaining[0]}' at position ${index}`,
      );
    }
  }
  return result;
}

const inputValue: string = process.argv[3] || "4:spam3:foo";
if (process.argv[2] === "decode") {
  try {
    const decoded = decodeBencode(inputValue);
    console.log("Decoded string:", decoded);
  } catch (error: any) {
    console.error("Error decoding bencoded string:", error.message);
  }
} else {
  console.log(
    "The default input value is '4:spam3:foo', which represents two bencoded strings: 'spam' and 'foo'.",
  );
  console.log("Decoded string:", decodeBencode(inputValue));
}
