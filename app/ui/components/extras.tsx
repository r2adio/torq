export default function Extras() {
  return (
    <box flexDirection="column" width="18%" gap={1}>
      <Blocks />
      <Dht />
      <Disk />
    </box>
  );
}

function Blocks() {
  return (
    <box
      title="Blocks"
      alignItems="stretch"
      justifyContent="flex-start"
      position="static"
      flexGrow={3}
      border={true}
      borderColor="grey"
    >
      <text fg="white"></text>
    </box>
  );
}

function Dht() {
  return (
    <box
      title="DHT"
      alignItems="stretch"
      justifyContent="flex-start"
      position="static"
      flexGrow={2}
      border={true}
      borderColor="grey"
    >
      <text fg="white"></text>
    </box>
  );
}

function Disk() {
  return (
    <box
      title="Disk"
      alignItems="stretch"
      justifyContent="flex-start"
      position="static"
      flexGrow={3}
      border={true}
      borderColor="grey"
    >
      <text fg="white"></text>
    </box>
  );
}
