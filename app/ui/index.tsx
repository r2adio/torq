import { createNodeApp } from "@rezi-ui/node";
import { Button, Page, Panel, Row, Spacer, Text } from "@rezi-ui/jsx";

type State = { count: number };

const app = createNodeApp<State>({
  initialState: { count: 0 },
});

app.view((state) => (
  <Page
    p={1}
    gap={1}
    body={
      <Panel title="Counter">
        <Row gap={1} items="center">
          <Text variant="heading">Count: {state.count}</Text>
          <Spacer flex={1} />
          <Button id="dec" label="-1" intent="secondary" />
          <Button id="inc" label="+1" intent="primary" />
        </Row>
      </Panel>
    }
  />
));

app.keys({
  q: () => app.stop(),
});

await app.start();
