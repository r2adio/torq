import { createCliRenderer } from "@opentui/core";
import { Box } from "@opentui/core";
import { extras, footer, network, stats, torrents } from "@/ui/components";

export function createApp(renderer: any) {
  return Box(
    { flexDirection: "column", paddingBottom: 1 },
    torrents(renderer),
    Box(
      { flexDirection: "row", justifyContent: "flex-start" },
      network(renderer),
      extras(renderer),
      stats(renderer),
    ),
    footer(renderer),
  );
}

const renderer = await createCliRenderer({ exitOnCtrlC: true, targetFps: 30 });
renderer.root.add(createApp(renderer));
renderer.start();
