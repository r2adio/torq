import { Column, Panel, Text } from "@rezi-ui/jsx";

type HomeScreenProps = {
  greeting: string;
};

export const HomeScreen = ({ greeting }: HomeScreenProps) => (
  <Panel title="Overview">
    <Column gap={1}>
      <Text variant="heading">{greeting}</Text>
      <Text variant="label">
        This is a starter screen you can replace with real content.
      </Text>
    </Column>
  </Panel>
);
