import type { NodeApp } from "@rezi-ui/node";
import type { UiState } from "@/ui/state";

const onRefresh = (app: NodeApp<UiState>): void => {
  app.update((state) => ({
    ...state,
    activity: [
      {
        id: `refresh-${Date.now()}`,
        title: "Refreshed",
        description: "Manual refresh completed.",
        time: "Just now",
      },
      ...state.activity,
    ],
  }));
};

const onToggleMode = (app: NodeApp<UiState>): void => {
  app.update((state) => ({
    ...state,
    greeting:
      state.greeting === "Welcome to Torq"
        ? "Focused mode enabled"
        : "Welcome to Torq",
  }));
};

const onHelp = (app: NodeApp<UiState>): void => {
  app.update((state) => ({
    ...state,
    activity: [
      {
        id: `help-${Date.now()}`,
        title: "Help",
        description: "Open docs or show a quick guide here.",
        time: "Just now",
      },
      ...state.activity,
    ],
  }));
};

const registerGlobalKeys = (app: NodeApp<UiState>): void => {
  app.keys({
    q: () => app.stop(),
    r: () => onRefresh(app),
    m: () => onToggleMode(app),
    "?": () => onHelp(app),
  });
};

export const actions = {
  onRefresh,
  onToggleMode,
  onHelp,
  registerGlobalKeys,
};
