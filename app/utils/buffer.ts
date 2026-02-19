export const bytesToString = (b: Uint8Array): string =>
  Buffer.from(b).toString("utf-8");
