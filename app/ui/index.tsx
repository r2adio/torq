import { render, useKeyboard, useRenderer } from "@opentui/solid";
import { Footer, Torrents } from "@/ui/components";

const App = () => {
  const renderer = useRenderer();
  useKeyboard((key) => {
    if (key.name === "q") renderer.destroy();
  });
  return (
    <box flexDirection="column" flexGrow={1}>
      <Torrents />
      <Footer />
    </box>
  );
};

render(App);
