import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// biome-ignore lint/style/noDefaultExport: Default export is required for vitest
export default defineConfig({
	plugins: [tsconfigPaths()],
});
