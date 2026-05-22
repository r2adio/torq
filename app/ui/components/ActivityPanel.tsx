import { Column, Panel, Text } from "@rezi-ui/jsx";
import type { UiActivity } from "@/ui/state";

type ActivityPanelProps = {
  entries: UiActivity[];
};

export const ActivityPanel = ({ entries }: ActivityPanelProps) => (
  <Panel title="Recent Activity">
    <Column gap={1}>
      {entries.map((entry) => (
        <Column key={entry.id} gap={0}>
          <Text variant="label">{entry.title}</Text>
          <Text>{entry.description}</Text>
          <Text variant="label">{entry.time}</Text>
        </Column>
      ))}
    </Column>
  </Panel>
);
