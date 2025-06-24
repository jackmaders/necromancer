import tsconfigPaths from "vite-tsconfig-paths";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

// biome-ignore lint/style/noDefaultExport: Default export is required for vitest
export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		coverage: {
			exclude: [
				...coverageConfigDefaults.exclude,
				"prisma/generated",
				"**/__mocks__/**",
			],
			reporter: "text",
		},
	},
});
