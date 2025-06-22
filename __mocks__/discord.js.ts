/** biome-ignore-all lint/style/useNamingConvention: Consistency with existing module */
import { vi } from "vitest";

const client = {
	login: vi.fn(),
	once: vi.fn(),
	user: {
		tag: "TestBot#1234",
	},
};

export const Client = vi.fn(() => client);

export const Events = {
	ClientReady: "ready",
};

export const GatewayIntentBits = {
	Guilds: 1,
};
