import { createCliRenderer } from "@opentui/core";
import { Box } from "@opentui/core";
import {
  extras,
  footer,
  network,
  stats,
  torrents,
  meta,
} from "@/ui/components";

interface Renderer {
  isDestroyed: boolean;
  requestLive(): void;
  dropLive(): void;
  on(event: "destroy", cb: () => void): void;
}

export function createApp(renderer: Renderer) {
  return Box(
    { flexDirection: "column", paddingBottom: 1 },
    Box({ flexDirection: "row" }, torrents(renderer), meta(renderer)),
    Box(
      { flexDirection: "row", justifyContent: "flex-start" },
      network(renderer),
      extras(renderer),
      stats(renderer),
    ),
    Box({}, footer(renderer)),
  );
}

const renderer = await createCliRenderer({ exitOnCtrlC: true, targetFps: 30 });
renderer.root.add(createApp(renderer));
renderer.start();
