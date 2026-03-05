import { Box, TextRenderable, TextAttributes } from "@opentui/core";
import getStats from "@/ui/utils/stats.util";
import type { Stats } from "@/ui/utils/stats.util";

const STATS_REFRESH_INTERVAL_MS = 1000;

interface StatConfig {
  label: string;
  key: keyof Stats;
  fg?: string;
  attributes?: number;
}

interface StatText {
  text: TextRenderable;
  key: keyof Stats;
  label: string;
}

function createStatTexts(renderer: any, configs: StatConfig[]): StatText[] {
  return configs.map((c) => ({
    text: new TextRenderable(renderer, {
      content: "",
      fg: c.fg ?? "white",
      attributes: c.attributes,
    }),
    key: c.key,
    label: c.label,
  }));
}

function updateStatTexts(stats: Stats, statTexts: StatText[]): void {
  for (const st of statTexts) {
    st.text.content = `${st.label}: ${stats[st.key]}`;
  }
}

const statConfigs: StatConfig[] = [
  { label: "Run Time", key: "runTime", fg: "green" },
  { label: "RSS Sync", key: "rssSync", fg: "white" },
  { label: "Torrents", key: "torrents", fg: "yellow" },
  {
    label: "DLL Speed",
    key: "dllSpeed",
    fg: "white",
    attributes: Number(TextAttributes.BOLD),
  },
  { label: "Session DLL", key: "sessionDll", fg: "white" },
  { label: "Lifetime DLL", key: "lifetimeDll", fg: "white" },
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

interface Renderer {
  isDestroyed: boolean;
  requestLive(): void;
  dropLive(): void;
  on(event: "destroy", cb: () => void): void;
}

export default function stats(renderer: Renderer) {
  const statTexts = createStatTexts(renderer, statConfigs);
  updateStatTexts(getStats(), statTexts);

  const statsInterval = setInterval(() => {
    if (renderer.isDestroyed) return;
    try {
      const currentStats = getStats();
      updateStatTexts(currentStats, statTexts);
    } catch (error) {
      console.error("Failed to update stats:", error);
    }
  }, STATS_REFRESH_INTERVAL_MS);

  renderer.requestLive();
  renderer.on("destroy", () => {
    clearInterval(statsInterval);
    renderer.dropLive();
  });

  const section0 = statTexts.slice(0, 3).map((st) => st.text);
  const section1 = statTexts.slice(3, 6).map((st) => st.text);
  const section2 = statTexts.slice(6, 9).map((st) => st.text);
  const section3 = statTexts.slice(9, 15).map((st) => st.text);
  const section4 = statTexts.slice(15).map((st) => st.text);

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
    Box({}, ...section0),
    Box({}, ...section1),
    Box({}, ...section2),
    Box({}, ...section3),
    Box({}, ...section4),
  );
}
