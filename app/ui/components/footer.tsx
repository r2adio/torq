import { RGBA, type ColorInput } from "@opentui/core";

type FooterSegment = {
  label: string;
  fg?: ColorInput;
};

type FooterItem = FooterSegment | { segments: FooterSegment[] };

const separator = " | ";
const defaultFg = RGBA.defaultForeground();

const renderSegment = (segment: FooterSegment) => (
  <text fg={segment.fg ?? defaultFg}>{segment.label}</text>
);

const renderItem = (item: FooterItem) =>
  "segments" in item ? item.segments.map(renderSegment) : [renderSegment(item)];

const renderSeparated = (items: FooterItem[]) =>
  items.flatMap((item, index) => [
    ...renderItem(item),
    ...(index < items.length - 1
      ? [<text fg={defaultFg}>{separator}</text>]
      : []),
  ]);

export default function Footer() {
  const metaItems = [
    { label: "torq", fg: "#ffffff" },
    { label: "v0.0.1", fg: "gray" },
    { label: "1 FPS", fg: "orange" },
    // { label: "Gruvbox Dark", fg: "white" },
    // { label: "Gruvbox Dark", fg: `${RGBA.fromIndex(7)}` },
    { label: "Gruvbox Dark", fg: RGBA.fromIndex(7) },
  ];
  const actionItems = [
    { segments: [{ label: "[arrow]", fg: "green" }, { label: " nav" }] },
    { segments: [{ label: "[Q]", fg: "green" }, { label: "uit" }] },
    { segments: [{ label: "[Paste]", fg: "green" }, { label: "paste" }] },
    { segments: [{ label: "[p]", fg: "green" }, { label: "ause" }] },
    { segments: [{ label: "[a]", fg: "green" }, { label: "dd" }] },
    { segments: [{ label: "[f]", fg: "green" }, { label: "iles" }] },
    { segments: [{ label: "[d]", fg: "green" }, { label: "elete" }] },
    { segments: [{ label: "[s]", fg: "green" }, { label: "ort" }] },
    { segments: [{ label: "[t]", fg: "green" }, { label: "ime" }] },
    { segments: [{ label: "[g]", fg: "green" }, { label: "raph" }] },
    { segments: [{ label: "[m]", fg: "teal" }, { label: "anual" }] },
  ];
  const statusItems = [
    { label: "Port: 42069", fg: "gray" },
    { label: "IPv4/IPv6", fg: "gray" },
    { label: "Closed", fg: "gray" },
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
