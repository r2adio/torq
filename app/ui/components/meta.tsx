import { TextAttributes } from "@opentui/core";

export default function Meta() {
  return (
    <box flexDirection="column" flexGrow={5}>
      <box flexDirection="row" gap={1}>
        <Details />
        <PeerStream />
      </box>
      <Swarm />
    </box>
  );
}

function Details() {
  return (
    <box
      title="Details"
      alignItems="stretch"
      justifyContent="flex-start"
      position="static"
      width="34%"
      border={true}
      borderColor="grey"
    >
      <box flexDirection="column" gap={0}>
        <text fg="gray">Progress:   ---.--% ---------</text>
        <text fg="gray">Status:     No Selection</text>
        <text fg="gray">Peers:      - (- / -)</text>
        <text fg="gray">Size:       - / -</text>
        <text fg="gray">Pieces:     - / -</text>
        <text fg="gray">ETA:        --:--:--</text>
        <text fg="gray">Announce:   --s</text>
      </box>
    </box>
  );
}

function PeerStream() {
  return (
    <box
      title="Peer Stream       Connected: 0  Discovered: 0  Disconnected: 0"
      alignItems="stretch"
      justifyContent="space-between"
      position="static"
      flexGrow={1}
      border={true}
      borderColor="grey"
    >
      <text fg="white"></text>
    </box>
  );
}

function Swarm() {
  return (
    <box
      alignItems="stretch"
      justifyContent="flex-start"
      position="static"
      width="100%"
      paddingX={1}
    >
      <text fg={"#d08700"} attributes={TextAttributes.BOLD}>
        Swarm Availability:
      </text>
      <text fg="white"> Waiting...</text>
    </box>
  );
}
