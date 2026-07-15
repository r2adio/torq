import { describe, it } from "node:test";
import assert from "node:assert";
import { decode, encode } from "@/torrent/parser.ts";
import type { BencodeValue } from "@/torrent/parser.ts";

function bytes(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

describe("bencode parser", () => {
  it("decodes primitive and nested values", () => {
    assert.strictEqual(decode(bytes("i-1e")), -1);

    assert.deepStrictEqual(
      Array.from(decode(bytes("3:foo")) as Uint8Array),
      Array.from(bytes("foo")),
    );
    assert.strictEqual((decode(bytes("0:")) as Uint8Array).length, 0);

    assert.deepStrictEqual(decode(bytes("li1e3:twoe")), [1, bytes("two")]);
    assert.deepStrictEqual(decode(bytes("le")), []);

    assert.deepStrictEqual(decode(bytes("d1:ali1ei2ee1:bi3ee")), {
      a: [1, 2],
      b: 3,
    });
    assert.deepStrictEqual(decode(bytes("de")), {});
  });

  it("round trips bencode values with sorted dictionary keys", () => {
    const value: { [key: string]: BencodeValue } = {
      z: 1,
      a: "x",
      list: [bytes("raw"), -2],
    };
    const encoded = encode(value);

    assert.strictEqual(
      Buffer.from(encoded).toString(),
      "d1:a1:x4:listl3:rawi-2ee1:zi1ee",
    );
    assert.deepStrictEqual(decode(encoded), {
      a: bytes("x"),
      list: [bytes("raw"), -2],
      z: 1,
    });
  });

  it("handles undefined values and non-finite numbers", () => {
    const obj: Record<string, BencodeValue> = {
      a: 1,
      b: undefined as unknown as BencodeValue,
      c: 3,
    };
    assert.strictEqual(Buffer.from(encode(obj)).toString(), "d1:ai1e1:ci3ee");

    assert.throws(() => encode(NaN));
    assert.throws(() => encode(Infinity));
  });

  it("rejects malformed bencode", () => {
    assert.throws(() => decode(bytes("x")), /Invalid bencode type/);
    assert.throws(() => decode(bytes("i12")), /Unterminated integer/);
    assert.throws(
      () => decode(bytes("4:abc")),
      /Invalid string: length exceeds data/,
    );
    assert.throws(() => decode(bytes("i1ee")), /Extra data/);
  });
});
