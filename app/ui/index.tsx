import { createNodeApp } from "@rezi-ui/node";
import { Column, Header, Panel, Row, StatusBar, Text } from "@rezi-ui/jsx";
import { actions } from "@/ui/actions";
import { createInitialState } from "@/ui/state";
import { ActivityPanel } from "@/ui/components/ActivityPanel";
import { QuickActions } from "@/ui/components/QuickActions";
import { StatsCard } from "@/ui/components/StatsCard";
import { HomeScreen } from "@/ui/screens/HomeScreen";

const app = createNodeApp({
  initialState: createInitialState(),
});

app.view((state) => (
  <Column gap={1} p={1}>
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
        <HomeScreen greeting={state.greeting} />
      </Column>
    </Row>
    <StatusBar
      left={[<Text key="status">Ready</Text>]}
      right={[<Text key="hint">Press q to quit</Text>]}
    />
  </Column>
));

actions.registerGlobalKeys(app);

await app.start();
