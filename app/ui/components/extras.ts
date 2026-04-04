import { Box, Text } from "@opentui/core";
interface Renderer {
  isDestroyed: boolean;
  requestLive(): void;
  dropLive(): void;
  on(event: "destroy", cb: () => void): void;
}

export default function extra(renderer: Renderer) {
  return Box(
    { flexDirection: "column", width: "10%" },
    blocks(renderer),
    disk(renderer),
  );
}
function blocks(renderer: Renderer) {
  return Box(
    {
      title: "Blocks",
      alignItems: "stretch",
      justifyContent: "space-between",
      position: "static",
      height: "50%",
      border: true,
      borderColor: "grey",
    },
    Text({ content: "Network stats will go here", fg: "white" }),
  );
}

function disk(renderer: Renderer) {
  return Box(
    {
      title: "Disk",
      alignItems: "stretch",
      justifyContent: "space-between",
      position: "static",
      height: "10%",
      flexGrow: 1,
      border: true,
      borderColor: "grey",
    },
    Text({ content: "", fg: "white" }),
  );
}
