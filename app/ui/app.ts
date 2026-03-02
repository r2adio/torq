import { Box } from "@opentui/core";
import footer from "@/ui/components/footer";

export function createApp(renderer: any) {
  return Box(
    { flexDirection: "column", height: "100%", width: "100%" },
    // meta(),
    Box(
      { flexDirection: "row", flexGrow: 1 },
      // networkActivity(),
      // stats(),
    ),
    footer(renderer),
  );
}
