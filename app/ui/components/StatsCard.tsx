import { Box, Column, Text } from "@rezi-ui/jsx";
import type { UiStats } from "@/ui/state";

type StatsCardProps = {
  stats: UiStats[];
};

export const StatsCard = ({ stats }: StatsCardProps) => (
  <Box border="single" title="Status Overview" p={1} flex={1}>
    <Column gap={1}>
      {stats.map((item) => (
        <Column key={item.title} gap={0}>
          <Text variant="label">{item.title}</Text>
          <Text variant="heading">{item.value}</Text>
          {item.detail ? <Text variant="label">{item.detail}</Text> : null}
        </Column>
      ))}
    </Column>
  </Box>
);
