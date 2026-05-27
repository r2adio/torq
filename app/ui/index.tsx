import { createNodeApp } from "@rezi-ui/node";
import { Column, Header, Panel, Row, StatusBar, Text } from "@rezi-ui/jsx";
import { actions } from "@/ui/actions";
import { createInitialState } from "@/ui/state";
import { ActivityPanel } from "@/ui/components/ActivityPanel";
import { QuickActions } from "@/ui/components/QuickActions";
import { StatsCard } from "@/ui/components/StatsCard";
import { HomeScreen } from "@/ui/screens/HomeScreen";
import { appRuntime } from "@/runtime";

const app = createNodeApp({
  initialState: createInitialState(),
});

const runtime = appRuntime.get();

const torrentPath = process.argv[2] ?? null;
if (torrentPath) {
  app.update((state) => ({
    ...state,
    torrentPath,
  }));

  runtime
    .engine
    .fetchPeers(torrentPath)
    .then((peers) => {
      app.update((state) => ({
        ...state,
        stats: state.stats.map((stat) =>
          stat.title === "Peers"
            ? {
                ...stat,
                value: String(peers.length),
                detail: "Tracker",
              }
            : stat,
        ),
        peersCount: peers.length,
      }));
    })
    .catch((error: any) => {
      app.update((state) => ({
        ...state,
        stats: state.stats.map((stat) =>
          stat.title === "Peers"
            ? {
                ...stat,
                value: "--",
                detail: "Error",
              }
            : stat,
        ),
        activity: [
          {
            id: `peers-error-${Date.now()}`,
            title: "Peer fetch failed",
            description: error.message ?? "Unable to reach tracker",
            time: "Just now",
          },
          ...state.activity,
        ],
      }));
    });
}

app.view((state) => (
  <Column gap={1} pb={1}>
    <Header title="Torq" subtitle="Rezi UI starter layout" />
    <Row gap={1}>
      <Column gap={1} flex={1}>
        <Panel title="Quick Actions">
          <QuickActions actions={state.actions} />
        </Panel>
      </Column>
      <Column gap={1} flex={3}>
        <Row gap={1}>
          <StatsCard stats={state.stats} />
          <ActivityPanel entries={state.activity} />
        </Row>
        <HomeScreen greeting={state.greeting} torrentPath={state.torrentPath} />
      </Column>
    </Row>
    <StatusBar
      left={[
        <Text key="status">
          {state.peersCount === null
            ? "Ready"
            : `Peers: ${state.peersCount}`}
        </Text>,
      ]}
      right={[<Text key="hint">Press q to quit</Text>]}
    />
  </Column>
));

actions.registerGlobalKeys(app);

await app.start();
