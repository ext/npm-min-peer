#!/usr/bin/env node

/* eslint-disable no-process-exit, no-console */

const { cli } = require("../dist");

cli(process.argv.slice(2))
	.then((exitCode) => process.exit(exitCode))
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
