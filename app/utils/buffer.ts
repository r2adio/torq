import crypto from "crypto";

export const bytesToString = (b: Uint8Array): string =>
  Buffer.from(b).toString("utf-8");

export const computeInfoHash = (rawInfo: Buffer): string => {
  return crypto.createHash("sha1").update(rawInfo).digest("hex");
};
