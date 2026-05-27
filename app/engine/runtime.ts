import { EventEmitter } from "events";
import { engine, type Engine } from "@/engine";

export type RuntimeStatus = "idle" | "running" | "stopped";

export type EngineRuntime = {
  engine: Engine;
  status: () => RuntimeStatus;
  start: () => void;
  stop: () => void;
  onStatus: (listener: (status: RuntimeStatus) => void) => () => void;
};

export const createEngineRuntime = (): EngineRuntime => {
  let currentStatus: RuntimeStatus = "idle";
  const emitter = new EventEmitter();

  const setStatus = (next: RuntimeStatus) => {
    if (currentStatus === next) return;
    currentStatus = next;
    emitter.emit("status", currentStatus);
  };

  const start = () => {
    if (currentStatus === "running") return;
    setStatus("running");
  };

  const stop = () => {
    if (currentStatus === "stopped") return;
    setStatus("stopped");
  };

  const onStatus = (listener: (status: RuntimeStatus) => void) => {
    emitter.on("status", listener);
    return () => emitter.off("status", listener);
  };

  return {
    engine,
    status: () => currentStatus,
    start,
    stop,
    onStatus,
  };
};
