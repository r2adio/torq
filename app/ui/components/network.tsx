export default function Network() {
  return (
    <box
      title="Activity  NET  CPU  RAM  DISK  TUNE  TOR  MULTI | 1m 5m 10m 30m 1h 3h 12h 24h 7d 30d 1y"
      alignItems="stretch"
      justifyContent="flex-start"
      position="static"
      flexGrow={8}
      border={true}
      borderColor="grey"
    >
      <text fg="gray">10.0 Kbps</text>
      <text fg="gray">5.0 Kbps</text>
      <text fg="gray">0</text>
      <text fg="gray">-10m   -8m   -6m   -4m   -2m   Now</text>
    </box>
  );
}
