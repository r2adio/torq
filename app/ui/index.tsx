import { render } from "@opentui/solid";
import { Footer, Torrents } from "@/ui/components";

const App = () => (
  <box flexDirection="column" flexGrow={1}>
    <Torrents />
    <Footer />
  </box>
);

render(App);
