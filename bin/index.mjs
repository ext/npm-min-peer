#!/usr/bin/env node

/* eslint-disable no-console -- cli tool, expected to log */

import { cli } from "../dist/index.mjs";

const argv = process.argv.slice(2);

try {
	process.exitCode = await cli(argv);
} catch (err) {
	console.error(err);
	process.exitCode = 1;
}
