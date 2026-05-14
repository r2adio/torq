import { render, useKeyboard, useRenderer } from "@opentui/solid";
import {
  Extras,
  Footer,
  Meta,
  Network,
  Stats,
  Torrents,
} from "@/ui/components";

const App = () => {
  const renderer = useRenderer();
  useKeyboard((key) => {
    if (key.name === "q") renderer.destroy();
  });
  return (
    <box flexDirection="column" flexGrow={1}>
      <box flexDirection="row" gap={1} flexGrow={3}>
        <Torrents />
        <Meta />
      </box>
      <box flexDirection="row" gap={1} flexGrow={5}>
        <Network />
        <Extras />
        <Stats />
      </box>
      <Footer />
    </box>
  );
};

render(App);
