import { Box, Text } from "@opentui/core";
interface Renderer {
  isDestroyed: boolean;
  requestLive(): void;
  dropLive(): void;
  on(event: "destroy", cb: () => void): void;
}

export default function torrents(renderer: Renderer) {
  return Box(
    {
      title: "/path/to/torrents",
      alignItems: "stretch",
      justifyContent: "space-between",
      position: "static",
      width: "45%",
      border: true,
      borderColor: "grey",
    },
    Text({ content: "Network stats will go here", fg: "white" }),
  );
}
