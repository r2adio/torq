const renderSeparated = (items: string[]) => <text>{items.join(" | ")}</text>;

export default function Footer() {
  const metaItems = ["torq", "v0.0.1", "1 FPS", "theme"];
  const actionItems = [
    "[arrow] nav",
    "[Q]uit",
    "[Paste]paste",
    "[p]ause",
    "[a]dd",
    "[f]iles",
    "[d]elete",
    "[t]ime",
    "[s]ort",
    "[t]ime",
    "[g]raph",
    "[m]anual",
  ];
  const statusItems = ["Port: 42069", "IPv4/IPv6", "Closed"];

  return (
    <box
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      flexGrow={1}
    >
      <box flexDirection="row" gap={1}>
        {renderSeparated(metaItems)}
      </box>
      <box flexDirection="row" gap={1}>
        {renderSeparated(actionItems)}
      </box>
      <box flexDirection="row" gap={1}>
        {renderSeparated(statusItems)}
      </box>
    </box>
  );
}
