import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			provider: "v8",
			reporter: ["text", "text-summary", "lcov"],
			include: ["src/**/*.[jt]s"],
			exclude: ["**/index.[jt]s"],
		},
	},
});
