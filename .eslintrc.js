require("@html-validate/eslint-config/patch/modern-module-resolution");

module.exports = {
	root: true,
	extends: ["@html-validate"],

	overrides: [
		{
			files: "*.ts",
			extends: ["@html-validate/typescript"],
		},
		{
			files: ["src/**/*.ts"],
			excludedFiles: ["src/**/*.spec.ts"],
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: ["./tsconfig.json"],
			},
			extends: ["@html-validate/typescript-typeinfo"],
		},
		{
			files: "*.spec.[jt]s",
			excludedFiles: ["cypress/**", "tests/e2e/**"],
			extends: ["@html-validate/jest"],
		},
	],
};
