import solidPlugin from "@opentui/solid/bun-plugin";

await Bun.build({
  entrypoints: ["./app/main.ts"],
  target: "bun",
  plugins: [solidPlugin],
  compile: {
    outfile: "torq",
    autoloadBunfig: false,
  },
});
