import { loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

// biome-ignore lint/style/noDefaultExport: Default export is required for vitest
export default defineConfig(({ mode }) => ({
	plugins: [tsconfigPaths()],
	test: {
		coverage: {
			exclude: [
				...coverageConfigDefaults.exclude,
				"prisma/generated",
				"**/__mocks__/**",
				"steiger.config.ts",
			],
			reporter: "text",
			thresholds: {
				branches: 100,
				functions: 100,
				lines: 100,
				statements: 100,
			},
		},
		env: loadEnv(mode, process.cwd(), ""),
		mockReset: true,
		setupFiles: ["./tests/setup.ts"],
		unstubEnvs: true,
	},
}));
