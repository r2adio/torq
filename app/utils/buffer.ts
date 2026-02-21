import crypto from "crypto";

export const bytesToString = (b: Uint8Array): string =>
  Buffer.from(b).toString("utf-8");

export const computeInfoHash = (rawInfo: Buffer): string => {
  return crypto.createHash("sha1").update(rawInfo).digest("hex");
};

// convert Buffer objects in JSON to their UTF-8 string representation
export const bufferReplacer = (_key: string, value: any) => {
  if (value?.type === "Buffer" && Array.isArray(value.data)) {
    return Buffer.from(value.data).toString("utf-8");
  }
  // if buffer contains non-printable characters, output as hex instead
  // if (value?.type === "Buffer" && Array.isArray(value.data)) {
  //   const buf = Buffer.from(value.data);
  //   const asUtf8 = buf.toString("utf-8");
  //   // Check if all characters are printable ASCII
  //   const isPrintable = /^[\x20-\x7E]+$/.test(asUtf8);
  //   return isPrintable ? asUtf8 : `<hex:${buf.toString("hex")}>`;
  // }
  return value;
};
