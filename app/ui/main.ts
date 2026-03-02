import { createCliRenderer } from "@opentui/core";
import { createApp } from "./app";

const renderer = await createCliRenderer({ exitOnCtrlC: true, targetFps: 30 });
renderer.root.add(createApp(renderer));
renderer.start();
