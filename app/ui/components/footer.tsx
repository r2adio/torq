export default function Footer() {
  return (
    <box
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      flexGrow={1}
    >
      <box>
        <text>torq</text>
      </box>
      <box flexDirection="row" gap={5}>
        <text>↑ ↓ ← → navigate</text>
        <text>[q]uit</text>
        <text>[v]paste</text>
        <text>[p]ause/resume</text>
        <text>[d]elete</text>
        <text>[s]ort</text>
        <text>[c]onfig</text>
        <text>[t]ime</text>
        <text>[/]search</text>
        <text>[m]anual</text>
      </box>
      <box flexDirection="row" gap={2}>
        <text>Port: 42069</text>
        <text>v0.1.0</text>
      </box>
    </box>
  );
}
