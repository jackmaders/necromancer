import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

// biome-ignore lint/style/noDefaultExport: steiger requires default export
export default defineConfig([
	...fsd.configs.recommended,
	{ ignores: ["**/__mocks__/**", "**/__tests__/**"] },
]);
