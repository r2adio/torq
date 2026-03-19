export const MESSAGE_TYPES = {
  CHOKE: 0,
  UNCHOKE: 1,
  INTERESTED: 2,
  NOT_INTERESTED: 3,
  HAVE: 4,
  BITFIELD: 5,
  REQUEST: 6,
  PIECE: 7,
  CANCEL: 8,
} as const;

export interface ParsedMessage {
  id: number;
  payload: Buffer;
}

export interface PieceMessage {
  index: number;
  begin: number;
  block: Buffer;
}

// build interested message to indicate we want to download
export function buildInterestedMessage(): Buffer {
  const message = Buffer.alloc(5);
  message.writeUInt32BE(1, 0); // length: 1
  message.writeUInt8(MESSAGE_TYPES.INTERESTED, 4); // id: 2
  return message;
}

// build request message for a specific block
// index: piece index, begin: byte offset within piece, length: block size
export function buildRequestMessage(
  index: number,
  begin: number,
  length: number,
): Buffer {
  const message = Buffer.alloc(17);
  message.writeUInt32BE(13, 0); // length: 13
  message.writeUInt8(MESSAGE_TYPES.REQUEST, 4); // id: 6
  message.writeUInt32BE(index, 5); // piece index
  message.writeUInt32BE(begin, 9); // begin offset
  message.writeUInt32BE(length, 13); // block length
  return message;
}

// parse message from peer
export function parseMessage(data: Buffer): ParsedMessage | null {
  if (data.length < 4) return null;

  const length = data.readUInt32BE(0);
  if (length === 0) return { id: -1, payload: Buffer.alloc(0) }; // keep-alive
  if (data.length < 4 + length) return null; // incomplete message

  const id = data.readUInt8(4);
  const payload = data.subarray(5, 4 + length);
  return { id, payload };
}

// parse piece message payload
export function parsePieceMessage(payload: Buffer): PieceMessage {
  const index = payload.readUInt32BE(0);
  const begin = payload.readUInt32BE(4);
  const block = payload.subarray(8);
  return { index, begin, block };
}
