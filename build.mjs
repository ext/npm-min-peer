import fs from "node:fs/promises";
import { build, analyzeMetafile } from "esbuild";

await fs.rm("dist", { recursive: true, force: true });

const result = await build({
	entryPoints: ["src/index.ts"],
	outdir: "dist",
	bundle: true,
	platform: "node",
	format: "esm",
	target: "node20.19",
	outExtension: { ".js": ".mjs" },
	external: ["./package.json"],
	logLevel: "info",
	metafile: true,
	sourcemap: true,
	banner: {
		js: [
			`import { createRequire as npmMinPeerCreateRequire } from "node:module";`,
			`const require = npmMinPeerCreateRequire(import.meta.url);`,
		].join("\n"),
	},
});

/* eslint-disable-next-line no-console -- expected to log */
console.log(await analyzeMetafile(result.metafile));
