import { RGBA, type ColorInput } from "@opentui/core";
import { useKeyboard } from "@opentui/solid";
import { createSignal, onCleanup } from "solid-js";

type FooterSegment = {
  label: string;
  fg?: ColorInput;
  keyId?: string;
};

type FooterItem = FooterSegment | { segments: FooterSegment[] };

const separator = " | ";
const defaultFg = RGBA.defaultForeground();

const renderSegment = (segment: FooterSegment, activeKey: string | null) => {
  const fg =
    segment.keyId && activeKey === segment.keyId ? "white" : segment.fg;
  return <text fg={fg ?? defaultFg}>{segment.label}</text>;
};

const renderItem = (item: FooterItem, activeKey: string | null) =>
  "segments" in item
    ? item.segments.map((segment) => renderSegment(segment, activeKey))
    : [renderSegment(item, activeKey)];

const renderSeparated = (items: FooterItem[], activeKey: string | null) =>
  items.flatMap((item, index) => [
    ...renderItem(item, activeKey),
    ...(index < items.length - 1
      ? [<text fg={defaultFg}>{separator}</text>]
      : []),
  ]);

export default function Footer() {
  const [activeKey, setActiveKey] = createSignal<string | null>(null);
  let resetTimeout: ReturnType<typeof setTimeout> | undefined;

  const normalizeKeyName = (name?: string) => {
    if (!name) return null;
    const normalized = name.toLowerCase();
    if (["up", "down", "left", "right"].includes(normalized)) return "arrow";
    return normalized;
  };

  useKeyboard((key) => {
    const normalized = normalizeKeyName(key.name);
    if (!normalized) return;
    setActiveKey(normalized);
    if (resetTimeout) clearTimeout(resetTimeout);
    resetTimeout = setTimeout(() => setActiveKey(null), 150);
  });

  onCleanup(() => {
    if (resetTimeout) clearTimeout(resetTimeout);
  });

  const metaItems = [
    { label: "torq", fg: "#ffffff" },
    { label: "v0.0.1", fg: "gray" },
    { label: "1 FPS", fg: "orange" },
    // { label: "Gruvbox Dark", fg: "white" },
    // { label: "Gruvbox Dark", fg: `${RGBA.fromIndex(7)}` },
    { label: "Gruvbox Dark", fg: RGBA.fromIndex(7) },
  ];
  const actionItems = [
    {
      segments: [
        { label: "[arrow]", fg: "green", keyId: "arrow" },
        { label: " nav" },
      ],
    },
    {
      segments: [{ label: "[Q]", fg: "green", keyId: "q" }, { label: "uit" }],
    },
    {
      segments: [
        { label: "[Paste]", fg: "green", keyId: "paste" },
        { label: "paste" },
      ],
    },
    {
      segments: [{ label: "[p]", fg: "green", keyId: "p" }, { label: "ause" }],
    },
    {
      segments: [{ label: "[a]", fg: "green", keyId: "a" }, { label: "dd" }],
    },
    {
      segments: [{ label: "[f]", fg: "green", keyId: "f" }, { label: "iles" }],
    },
    {
      segments: [{ label: "[d]", fg: "green", keyId: "d" }, { label: "elete" }],
    },
    {
      segments: [{ label: "[s]", fg: "green", keyId: "s" }, { label: "ort" }],
    },
    {
      segments: [{ label: "[t]", fg: "green", keyId: "t" }, { label: "ime" }],
    },
    {
      segments: [{ label: "[g]", fg: "green", keyId: "g" }, { label: "raph" }],
    },
    {
      segments: [{ label: "[m]", fg: "teal", keyId: "m" }, { label: "anual" }],
    },
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
        {renderSeparated(metaItems, activeKey())}
      </box>
      <box flexDirection="row" gap={0}>
        {renderSeparated(actionItems, activeKey())}
      </box>
      <box flexDirection="row" gap={0}>
        {renderSeparated(statusItems, activeKey())}
      </box>
    </box>
  );
}
