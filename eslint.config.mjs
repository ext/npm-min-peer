/* This file is managed by @html-validate/eslint-config */
/* Changes may be overwritten */

import defaultConfig from "@html-validate/eslint-config";
import typescriptConfig from "@html-validate/eslint-config-typescript";
import typescriptTypeinfoConfig from "@html-validate/eslint-config-typescript-typeinfo";
import vitestConfig from "@html-validate/eslint-config-vitest";

export default [
	{
		name: "Ignored files",
		ignores: [
			"**/coverage/**",
			"**/dist/**",
			"**/node_modules/**",
			"**/out/**",
			"**/public/assets/**",
			"**/temp/**",
		],
	},

	...defaultConfig,

	{
		name: "@html-validate/eslint-config-typescript",
		files: ["**/*.{ts,cts,mts}"],
		...typescriptConfig,
	},

	{
		name: "@html-validate/eslint-config-typeinfo",
		files: ["src/**/*.{ts,cts,mts}"],
		ignores: ["src/**/*.spec.ts"],
		languageOptions: {
			parserOptions: {
				tsconfigRootDir: import.meta.dirname,
				projectService: true,
			},
		},
		...typescriptTypeinfoConfig,
	},

	{
		name: "@html-validate/eslint-config-vitest",
		files: ["**/*.spec.[jt]s"],
		ignores: ["cypress/**", "tests/e2e/**"],
		...vitestConfig,
	},

	{
		name: "local/semantic-release",
		files: ["release.config.mjs"],
		rules: {
			"import/no-unresolved": "off",
		},
	},
];
