import { render } from "@opentui/solid";

render(() => (
  <box
    flexDirection="row"
    alignItems="center"
    justifyContent="space-between"
    flexGrow={1}
  >
    <box>
      <text>torq</text>
    </box>

    <box flexDirection="row">
      <text>↑ ↓ ← → navigate</text>
      <text> [q]uit</text>
      <text> [v]paste</text>
      <text> [p]ause/resume</text>
      <text> [d]elete</text>
      <text> [s]ort</text>
      <text> [c]onfig</text>
      <text> [t]ime</text>
      <text> [/]search</text>
      <text> [m]anual</text>
    </box>

    <box flexDirection="row">
      <text>Port: 42069</text>
      <text> v0.1.0</text>
    </box>
  </box>
));

// import { createCliRenderer } from "@opentui/core";
// import { Box } from "@opentui/core";
// import {
//   extras,
//   footer,
//   network,
//   stats,
//   torrents,
//   meta,
// } from "@/ui/components";
//
// interface Renderer {
//   isDestroyed: boolean;
//   requestLive(): void;
//   dropLive(): void;
//   on(event: "destroy", cb: () => void): void;
// }
//
// export function createApp(renderer: Renderer) {
//   return Box(
//     { flexDirection: "column", paddingBottom: 1 },
//     Box({ flexDirection: "row" }, torrents(renderer), meta(renderer)),
//     Box(
//       { flexDirection: "row", justifyContent: "flex-start" },
//       network(renderer),
//       extras(renderer),
//       stats(renderer),
//     ),
//     Box({}, footer(renderer)),
//   );
// }
//
// const renderer = await createCliRenderer({ exitOnCtrlC: true, targetFps: 30 });
// renderer.root.add(createApp(renderer));
// renderer.start();
