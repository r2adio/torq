import { Column, Panel, Text } from "@rezi-ui/jsx";

type HomeScreenProps = {
  greeting: string;
  torrentPath: string | null;
};

export const HomeScreen = ({ greeting, torrentPath }: HomeScreenProps) => (
  <Panel title="Overview">
    <Column gap={1}>
      <Text variant="heading">{greeting}</Text>
      {torrentPath ? (
        <Text variant="label">Torrent: {torrentPath}</Text>
      ) : (
        <Text variant="label">Run with a torrent path to load peers.</Text>
      )}
    </Column>
  </Panel>
);
