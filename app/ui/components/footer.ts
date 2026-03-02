import { Box, Text, TextAttributes } from "@opentui/core";
export default function footer() {
  return Box(
    {
      alignItems: "stretch",
      justifyContent: "space-between",
      position: "absolute",
      paddingX: 3,
      bottom: 2,
      height: 0,
      width: "100%",
      flexDirection: "row",
    },
    // project name, version
    Box(
      { flexDirection: "row", alignItems: "center", gap: 1 },
      Text({ content: "torq", fg: "orange" }),
      Text({ content: "v0.1.0" }),
    ),
    // project navigation hints
    Box(
      { flexDirection: "row", alignItems: "center", gap: 3 },
      Text({ content: "↑ ↓ ← → navigate", attributes: TextAttributes.DIM }),
      Text({ content: "[q]uit", attributes: TextAttributes.DIM }),
      Text({ content: "[v]paste", attributes: TextAttributes.DIM }),
      Text({ content: "[p]ause/resume", attributes: TextAttributes.DIM }),
      Text({ content: "[d]elete", attributes: TextAttributes.DIM }),
      Text({ content: "[s]ort", attributes: TextAttributes.DIM }),
      Text({ content: "[c]onfig", attributes: TextAttributes.DIM }),
      Text({ content: "[t]ime", attributes: TextAttributes.DIM }),
      Text({ content: "[/]search", attributes: TextAttributes.DIM }),
      Text({ content: "[m]anual", attributes: TextAttributes.DIM }),
    ),
    // meta info about client, eg: port, upload/download speed, connected peers, etc.
    Box(
      { flexDirection: "row", alignItems: "center", gap: 1 },
      Text({ content: `Port: `, attributes: TextAttributes.DIM }),
      Text({ content: "v0.1.0", attributes: TextAttributes.DIM }),
    ),
  );
}
