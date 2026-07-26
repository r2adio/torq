import assert from "node:assert";
import { describe, it } from "node:test";
import { singleFileTorrentFixture } from "./torrent-fixtures.help.ts";

describe("Torrent Metadata", () => {
  it("parses single-file metadata", () => {
    const fixture = singleFileTorrentFixture({
      announceList: [["http://tracker-a.example/announce"], ["udp://tracker-b.example:6969"]],
    });
    const metadata = fixture.metadata;

    assert.strictEqual(metadata.name, "sample.bin");
    assert.strictEqual(metadata.totalSize, 12);
    assert.strictEqual(metadata.pieceLength, 4);
    assert.strictEqual(metadata.pieceCount, 3);
    assert.deepStrictEqual(metadata.files, [
      { path: "sample.bin", length: 12, offset: 0 }, // deepStrictEqual for arrays and objects
    ]);
    assert.strictEqual(metadata.formatSize(), "0.0 KB");
    assert.strictEqual(metadata.formatPieceLength(), "0 KB");
  });
});
