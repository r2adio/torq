import { ASCIIFont, Box, Text, TextAttributes } from "@opentui/core";
export function createApp() {
  return Box(
    {
      alignItems: "center",
      justifyContent: "center",
      flexGrow: 1,
      borderStyle: "single",
    },
    Box(
      { justifyContent: "center", alignItems: "flex-end" },
      ASCIIFont({ font: "tiny", text: "torq" }),
      Text({ content: "a BitTorrent client", attributes: TextAttributes.DIM }),
    ),
  );
}
