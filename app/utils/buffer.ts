import crypto from "crypto";

export const bytesToString = (b: Uint8Array): string =>
  Buffer.from(b).toString("utf-8");

export const computeInfoHash = (rawInfo: Buffer): string => {
  return crypto.createHash("sha1").update(rawInfo).digest("hex");
};

export const bufferReplacer = (_key: string, value: any) => {
  if (value instanceof Buffer) {
    return value.toString("utf-8");
  }
  return value;
};
