#!/usr/bin/env node

/* eslint-disable no-console -- cli tool, expected to log */

const { cli } = require("../dist");

const argv = process.argv.slice(2);
cli(argv)
	.then((exitCode) => {
		process.exitCode = exitCode;
	})
	.catch((err) => {
		console.error(err);
		process.exitCode = 1;
	});
