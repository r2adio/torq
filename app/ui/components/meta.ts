import { Box, Text, TextAttributes } from "@opentui/core";
interface Renderer {
  isDestroyed: boolean;
  requestLive(): void;
  dropLive(): void;
  on(event: "destroy", cb: () => void): void;
}

export default function meta(renderer: Renderer) {
  return Box(
    { flexDirection: "column" },
    Box({ flexDirection: "row" }, details(renderer), peer_stream(renderer)),
    swarm(renderer),
  );
}

function details(_: Renderer) {
  return Box(
    {
      title: "Details",
      alignItems: "stretch",
      justifyContent: "space-between",
      position: "static",
      width: "40%",
      border: true,
      borderColor: "grey",
    },
    Text({ content: "Progress: ", fg: "white" }),
    Text({ content: "Progress: ", fg: "white" }),
    Text({ content: "Progress: ", fg: "white" }),
    Text({ content: "Progress: ", fg: "white" }),
    Text({ content: "Progress: ", fg: "white" }),
    Text({ content: "Progress: ", fg: "white" }),
  );
}

function peer_stream(_: Renderer) {
  return Box(
    {
      title: "Peer Stream       Connected: 0  Discovered: 0  Disconnected: 0",
      // title: "Peer Strea",
      alignItems: "stretch",
      justifyContent: "space-between",
      position: "static",
      paddingX: 3,
      flexGrow: 1,
      width: "15%",
      border: true,
      borderColor: "grey",
    },
    Text({ content: "", fg: "white" }),
  );
}

function swarm(_: Renderer) {
  return Box(
    {
      alignItems: "stretch",
      justifyContent: "flex-start",
      position: "static",
      width: "100%",
      // height: 5,
      paddingX: 1,
    },
    Text({
      content: "Swarm Availability",
      attributes: TextAttributes.BOLD,
      fg: "white",
    }),
  );
}
