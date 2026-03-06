import { Box, Text, TextRenderable, TextAttributes, RGBA } from "@opentui/core";

const TORQ_COLORS: RGBA[] = [
  RGBA.fromHex("#ff6b6b")!,
  RGBA.fromHex("#feca57")!,
  RGBA.fromHex("#48dbfb")!,
  RGBA.fromHex("#ff9ff3")!,
  RGBA.fromHex("#54a0ff")!,
  RGBA.fromHex("#5f27cd")!,
];

export default function footer(renderer: any) {
  let torqColorIndex = 0;

  const torqText = new TextRenderable(renderer, {
    content: "torq",
    fg: TORQ_COLORS[torqColorIndex],
  });

  const colorInterval = setInterval(() => {
    if (renderer.isDestroyed) return;
    torqColorIndex = (torqColorIndex + 1) % TORQ_COLORS.length;
    torqText.fg = TORQ_COLORS[torqColorIndex];
  }, 1000);

  renderer.requestLive();

  renderer.on("destroy", () => {
    clearInterval(colorInterval);
    renderer.dropLive();
  });

  return Box(
    {
      alignItems: "stretch",
      justifyContent: "space-between",
      position: "absolute",
      paddingX: 3,
      bottom: 1,
      height: 0,
      width: "100%",
      flexDirection: "row",
    },
    // project name, version
    Box(
      { flexDirection: "row", alignItems: "center", gap: 1 },
      torqText,
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
