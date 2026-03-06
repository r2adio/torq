import { Box, Text } from "@opentui/core";
interface Renderer {
  isDestroyed: boolean;
  requestLive(): void;
  dropLive(): void;
  on(event: "destroy", cb: () => void): void;
}

export default function network(renderer: Renderer) {
  return Box(
    {
      title: "/path/to/torrents",
      alignItems: "stretch",
      justifyContent: "space-between",
      position: "static",
      paddingX: 3,
      height: "60%",
      bottom: 1,
      border: true,
      borderColor: "grey",
    },
    Text({ content: "Network stats will go here", fg: "white" }),
  );
}
