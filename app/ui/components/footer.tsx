type FooterSegment = {
  label: string;
  fg?: string;
};

type FooterItem = FooterSegment | { segments: FooterSegment[] };

const separator = " | ";

const renderSegment = (segment: FooterSegment) => (
  <text fg={segment.fg}>{segment.label}</text>
);

const renderItem = (item: FooterItem) =>
  "segments" in item ? item.segments.map(renderSegment) : [renderSegment(item)];

const renderSeparated = (items: FooterItem[]) =>
  items.flatMap((item, index) => [
    ...renderItem(item),
    ...(index < items.length - 1 ? [<text>{separator}</text>] : []),
  ]);

export default function Footer() {
  const metaItems = [
    { label: "torq", fg: "#ffffff" },
    { label: "v0.0.1", fg: "#808080" },
    { label: "1 FPS", fg: "#ffd54f" },
    { label: "theme" },
  ];
  const actionItems = [
    {
      segments: [{ label: "[arrow]", fg: "#00ff00" }, { label: " nav" }],
    },
    { label: "[Q]uit" },
    { label: "[Paste]paste" },
    { label: "[p]ause" },
    { label: "[a]dd" },
    { label: "[f]iles" },
    { label: "[d]elete" },
    { label: "[t]ime" },
    { label: "[s]ort" },
    { label: "[t]ime" },
    { label: "[g]raph" },
    { label: "[m]anual" },
  ];
  const statusItems = [
    { label: "Port: 42069" },
    { label: "IPv4/IPv6" },
    { label: "Closed" },
  ];

  return (
    <box
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      flexGrow={1}
    >
      <box flexDirection="row" gap={0}>
        {renderSeparated(metaItems)}
      </box>
      <box flexDirection="row" gap={0}>
        {renderSeparated(actionItems)}
      </box>
      <box flexDirection="row" gap={0}>
        {renderSeparated(statusItems)}
      </box>
    </box>
  );
}
