/* This file is managed by @html-validate/eslint-config */
/* Changes may be overwritten */

import path from "node:path";
import { fileURLToPath } from "node:url";
import defaultConfig from "@html-validate/eslint-config";
import typescriptConfig from "@html-validate/eslint-config-typescript";
import typescriptTypeinfoConfig from "@html-validate/eslint-config-typescript-typeinfo";
import jestConfig from "@html-validate/eslint-config-jest";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default [
	{
		name: "Ignored files",
		ignores: [
			"**/coverage/**",
			"**/dist/**",
			"**/node_modules/**",
			"**/public/assets/**",
			"**/temp/**",
		],
	},
	...defaultConfig,
	...typescriptConfig,
	{
		name: "Typescript typeinfo configuration",
		files: ["src/**/*.ts"],
		ignores: ["src/**/*.spec.ts"],
		languageOptions: {
			parserOptions: {
				tsconfigRootDir: rootDir,
				project: ["./tsconfig.json"],
			},
		},
	},
	...typescriptTypeinfoConfig,
	...jestConfig,
	{
		/* files which should lint even if project isn't build yet */
		files: ["./*.d.ts", "bin/*.js"],
		rules: {
			"import/export": "off",
			"import/extensions": "off",
			"import/no-unresolved": "off",
		},
	},
];
