import { createEngineRuntime } from "@/engine/runtime";

const runtime = createEngineRuntime();

export const appRuntime = {
  get: () => runtime,
};
