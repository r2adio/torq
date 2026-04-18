import { Box, Text } from "@opentui/core";
interface Renderer {
  isDestroyed: boolean;
  requestLive(): void;
  dropLive(): void;
  on(event: "destroy", cb: () => void): void;
}

export default function torrents(_: Renderer) {
  return Box(
    {
      title: "/path/to/torrents",
      alignItems: "stretch",
      justifyContent: "flex-start",
      position: "static",
      maxHeight: 17,
      width: "45%",
      border: true,
      borderColor: "grey",
    },
    Text({ content: "Name", fg: "white" }),
    Text({ content: "Torrent 1: ", fg: "white" }),
    Text({ content: "Torrent 2: ", fg: "white" }),
    Text({ content: "Torrent 3: ", fg: "white" }),
    Text({ content: "Torrent 4: ", fg: "white" }),
    Text({ content: "Torrent 5: ", fg: "white" }),
    Text({ content: "Torrent 6: ", fg: "white" }),
    Text({ content: "Torrent 7: ", fg: "white" }),
    Text({ content: "Torrent 8: ", fg: "white" }),
    Text({ content: "Torrent 9: ", fg: "white" }),
    Text({ content: "Torrent 10: ", fg: "white" }),
    Text({ content: "Torrent 11: ", fg: "white" }),
    Text({ content: "Torrent 12: ", fg: "white" }),
    Text({ content: "Torrent 13: ", fg: "white" }),
    Text({ content: "Torrent 14: ", fg: "white" }),
    // Text({ content: "Torrent 15: ", fg: "white" }),
    // Text({ content: "Torrent 16: ", fg: "white" }),
  );
}
