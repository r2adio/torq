import { Box } from "@opentui/core";
import footer from "@/ui/components/footer";

export function createApp() {
  return Box(
    { flexDirection: "column", height: "100%", width: "100%" },
    // meta(),
    Box(
      { flexDirection: "row", flexGrow: 1 },
      // networkActivity(),
      // stats(),
    ),
    footer(),
    // { alignItems: "center", justifyContent: "center", flexGrow: 1 },
    // Box(
    //   { justifyContent: "center", alignItems: "flex-end" },
    //   ASCIIFont({ font: "tiny", text: "torq" }),
    //   Text({ content: "a BitTorrent client", attributes: TextAttributes.DIM }),
    // ),
    // footer(),
  );
}
