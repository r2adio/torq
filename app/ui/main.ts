import { createCliRenderer } from "@opentui/core";
import { createApp } from "./app";

const renderer = await createCliRenderer({ exitOnCtrlC: true });
renderer.root.add(createApp());
