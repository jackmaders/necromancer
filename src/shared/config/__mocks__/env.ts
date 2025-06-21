/** biome-ignore-all lint/style/useNamingConvention: Environment variables are CONSTANT_CASE */
import { vi } from "vitest";

export const env = vi.fn(() => ({
	DISCORD_TOKEN: "DISCORD_TOKEN",
	PRISMA_DATABASE_URL: "PRISMA_DATABASE_URL",
}));
