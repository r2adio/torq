import { createCliRenderer } from "@opentui/core";
import { Box } from "@opentui/core";
import { footer, stats } from "@/ui/components";

export function createApp(renderer: any) {
  return Box(
    { flexDirection: "column", height: "100%", width: "100%" },
    // meta(),
    Box(
      { flexDirection: "row", flexGrow: 1 },
      // networkActivity(),
      stats(renderer),
    ),
    footer(renderer),
  );
}

const renderer = await createCliRenderer({ exitOnCtrlC: true, targetFps: 30 });
renderer.root.add(createApp(renderer));
renderer.start();
