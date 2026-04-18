import { Box, Text } from "@opentui/core";
interface Renderer {
  isDestroyed: boolean;
  requestLive(): void;
  dropLive(): void;
  on(event: "destroy", cb: () => void): void;
}

export default function network(_: Renderer) {
  return Box(
    {
      title: "Network Activity",
      alignItems: "stretch",
      justifyContent: "space-between",
      position: "static",
      // flexGrow: 1,
      width: "70%",
      border: true,
      borderColor: "grey",
    },
    Text({ content: "Network stats will go here", fg: "white" }),
  );
}
