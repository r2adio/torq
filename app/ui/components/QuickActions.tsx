import { Column, Row, Tag, Text } from "@rezi-ui/jsx";
import type { UiAction } from "@/ui/state";

type QuickActionsProps = {
  actions: UiAction[];
};

export const QuickActions = ({ actions }: QuickActionsProps) => (
  <Column gap={1}>
    {actions.map((action) => (
      <Row key={action.id} gap={1} items="center">
        <Text>{action.label}</Text>
        {action.hint ? <Tag text={action.hint} /> : null}
      </Row>
    ))}
  </Column>
);
