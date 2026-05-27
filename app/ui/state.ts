export type UiAction = {
  id: string;
  label: string;
  hint?: string;
};

export type UiStats = {
  title: string;
  value: string;
  detail?: string;
};

export type UiActivity = {
  id: string;
  title: string;
  description: string;
  time: string;
};

export type UiState = {
  greeting: string;
  stats: UiStats[];
  activity: UiActivity[];
  actions: UiAction[];
  torrentPath: string | null;
  peersCount: number | null;
};

export const createInitialState = (): UiState => ({
  greeting: "Welcome to Torq",
  stats: [
    { title: "Sessions", value: "1", detail: "Runtime" },
    { title: "Peers", value: "--", detail: "Unknown" },
    { title: "Latency", value: "--", detail: "Tracker" },
  ],
  activity: [
    {
      id: "boot",
      title: "System boot",
      description: "Runtime initialized and ready.",
      time: "Just now",
    },
    {
      id: "sync",
      title: "Sync complete",
      description: "Local cache is up to date.",
      time: "2m ago",
    },
  ],
  actions: [
    { id: "refresh", label: "Refresh", hint: "r" },
    { id: "toggle", label: "Toggle Mode", hint: "m" },
    { id: "help", label: "Help", hint: "?" },
  ],
  torrentPath: null,
  peersCount: null,
});
