import { Box, Text, TextAttributes } from "@opentui/core";

function getStats() {
  return {
    runTime: "1h 23m",
    rssSync: "5s",
    torrents: 42,
  };
}

export default function stats(renderer: any) {
  return Box(
    {
      title: "Stats",
      alignItems: "stretch",
      justifyContent: "space-between",
      position: "absolute",
      paddingX: 3,
      bottom: 2,
      border: true,
      borderColor: "grey",
      gap: 1,
    },
    Box(
      {},
      Text({ content: `Run Time: ${getStats().runTime}`, fg: "green" }),
      Text({ content: `RSS Sync: ${getStats().rssSync}`, fg: "blue" }),
      Text({ content: `Torrents: ${getStats().torrents}`, fg: "yellow" }),
    ),
    Box(
      {},
      Text({
        content: `DLL Speed: ${getStats().runTime}`,
        attributes: TextAttributes.BOLD,
      }),
      Text({ content: `Session DLL: ${getStats().rssSync}` }),
      Text({ content: `Lifetime DLL: ${getStats().torrents}` }),
    ),
    Box(
      {},
      Text({
        content: `UL Speed: ${getStats().runTime}`,
        attributes: TextAttributes.BOLD,
      }),
      Text({ content: `Session UL: ${getStats().rssSync}` }),
      Text({ content: `Lifetime UL: ${getStats().torrents}` }),
    ),
    Box(
      {},
      Text({ content: `CPU: ${getStats().runTime}` }),
      Text({ content: `RAM: ${getStats().rssSync}` }),
      Text({ content: `Disk: ${getStats().torrents}` }),
      Text({ content: `Seek: ${getStats().torrents}` }),
      Text({ content: `Latency: ${getStats().torrents}` }),
      Text({ content: `IOPS: ${getStats().torrents}` }),
    ),
    Box(
      {},
      Text({ content: `Self-Tune (${getStats().torrents}): ` }),
      Text({ content: `Disk Thrash: ${getStats().torrents}` }),
      Text({ content: `Reserve Slots: ${getStats().torrents}` }),
      Text({ content: `Peer Slots: ${getStats().torrents}` }),
      Text({ content: `Read Slots: ${getStats().torrents}` }),
      Text({ content: `Write Slots: ${getStats().torrents}` }),
    ),
  );
}
