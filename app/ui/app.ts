import { ASCIIFont, Box, Text, TextAttributes } from "@opentui/core";
function footer() {
  return Box(
    {
      alignItems: "stretch",
      justifyContent: "space-between",
      position: "absolute",
      paddingX: 3,
      bottom: 2,
      height: 0,
      width: "100%",
      // borderStyle: "single",
      flexDirection: "row",
    },
    // project name, version
    Box(
      { flexDirection: "row", alignItems: "center", gap: 1 },
      Text({ content: "torq", attributes: TextAttributes.DIM }),
      Text({ content: `v0.1.0`, attributes: TextAttributes.DIM }),
    ),
    // project navigation hints
    Box(
      { flexDirection: "row", alignItems: "center", gap: 1 },
      Text({ content: "torq", attributes: TextAttributes.DIM }),
      Text({ content: "v0.1.0", attributes: TextAttributes.DIM }),
    ),
    // meta info about client, eg: port, upload/download speed, connected peers, etc.
    Box(
      { flexDirection: "row", alignItems: "center", gap: 1 },
      Text({ content: `Port: `, attributes: TextAttributes.DIM }),
      Text({ content: "v0.1.0", attributes: TextAttributes.DIM }),
    ),
  );
}

export function createApp() {
  return Box(
    {
      alignItems: "center",
      justifyContent: "center",
      flexGrow: 1,
      // borderStyle: "single",
    },
    Box(
      { justifyContent: "center", alignItems: "flex-end" },
      ASCIIFont({ font: "tiny", text: "torq" }),
      Text({ content: "a BitTorrent client", attributes: TextAttributes.DIM }),
    ),
    footer(),
  );
}
