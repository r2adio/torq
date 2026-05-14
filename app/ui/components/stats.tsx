import { TextAttributes } from "@opentui/core";
import { useRenderer } from "@opentui/solid";
import { createSignal, onCleanup, onMount } from "solid-js";
import getStats, { type Stats } from "@/ui/utils/stats.util";

const STATS_REFRESH_INTERVAL_MS = 1000;

interface StatConfig {
  label: string;
  key: keyof Stats;
  fg?: string;
  attributes?: number;
}

const statConfigs: StatConfig[] = [
  { label: "Run Time", key: "runTime", fg: "white" },
  { label: "RSS Sync", key: "rssSync", fg: "white" },
  { label: "Torrents", key: "torrents", fg: "white" },
  {
    label: "DL Speed",
    key: "dllSpeed",
    fg: "white",
    attributes: Number(TextAttributes.BOLD),
  },
  { label: "Session DL", key: "sessionDll", fg: "white" },
  { label: "Lifetime DL", key: "lifetimeDll", fg: "white" },
  {
    label: "UL Speed",
    key: "ulSpeed",
    fg: "white",
    attributes: Number(TextAttributes.BOLD),
  },
  { label: "Session UL", key: "sessionUl", fg: "white" },
  { label: "Lifetime UL", key: "lifetimeUl", fg: "white" },
  { label: "CPU", key: "cpu", fg: "white" },
  { label: "RAM", key: "ram", fg: "white" },
  { label: "Disk", key: "disk", fg: "white" },
  { label: "Seek", key: "seek", fg: "white" },
  { label: "Latency", key: "latency", fg: "white" },
  { label: "IOPS", key: "iops", fg: "white" },
  { label: "Self-Tune", key: "selfTune", fg: "white" },
  { label: "Disk Thrash", key: "diskThrash", fg: "white" },
  { label: "Reserve Slots", key: "reserveSlots", fg: "white" },
  { label: "Peer Slots", key: "peerSlots", fg: "white" },
  { label: "Read Slots", key: "readSlots", fg: "white" },
  { label: "Write Slots", key: "writeSlots", fg: "white" },
];

export default function Stats() {
  const renderer = useRenderer();
  const [stats, setStats] = createSignal<Stats>(getStats());

  let statsInterval: ReturnType<typeof setInterval> | undefined;

  onMount(() => {
    // `setInterval` alone can be throttled by the renderer when idle.
    // Request live mode while we're doing periodic updates.
    renderer.requestLive();
    statsInterval = setInterval(() => {
      if (renderer.isDestroyed) return;
      try {
        setStats(getStats());
      } catch (error) {
        console.error("Failed to update stats:", error);
      }
    }, STATS_REFRESH_INTERVAL_MS);
  });

  onCleanup(() => {
    if (statsInterval) clearInterval(statsInterval);
    renderer.dropLive();
  });

  const sections = [
    statConfigs.slice(0, 3),
    statConfigs.slice(3, 6),
    statConfigs.slice(6, 9),
    statConfigs.slice(9, 15),
    statConfigs.slice(15),
  ];

  return (
    <box
      title="Stats | Lvl 0 [---------] 0%"
      alignItems="stretch"
      justifyContent="flex-start"
      position="relative"
      gap={1}
      flexDirection="row"
      flexGrow={4}
      border={true}
      borderColor="grey"
    >
      {sections.map((section) => (
        <box flexDirection="column">
          {section.map((c) => (
            <text fg={c.fg ?? "white"} attributes={c.attributes}>
              {c.label}: {String(stats()[c.key])}
            </text>
          ))}
        </box>
      ))}
    </box>
  );
}
