import { Box, Text } from "@opentui/core";
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

function details(renderer: Renderer) {
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
    Text({ content: "Progrss: ", fg: "white" }),
    Text({ content: "Progrss: ", fg: "white" }),
    Text({ content: "Progrss: ", fg: "white" }),
    Text({ content: "Progrss: ", fg: "white" }),
    Text({ content: "Progrss: ", fg: "white" }),
    Text({ content: "Progrss: ", fg: "white" }),
    Text({ content: "Progrss: ", fg: "white" }),
  );
}

function peer_stream(renderer: Renderer) {
  return Box(
    {
      title: "Peer Stream",
      alignItems: "stretch",
      justifyContent: "space-between",
      position: "static",
      paddingX: 3,
      flexGrow: 1,
      border: true,
      borderColor: "grey",
    },
    Text({ content: "", fg: "white" }),
  );
}

function swarm(renderer: Renderer) {
  return Box(
    {
      title: "Swarm Availability",
      alignItems: "stretch",
      justifyContent: "space-between",
      position: "static",
      height: 0,
      border: true,
      borderColor: "white",
    },
    Text({ content: "", fg: "white" }),
  );
}
