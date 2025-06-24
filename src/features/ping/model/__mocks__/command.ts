import { vi } from "vitest";

export const pingCommand = {
	data: {
		description: "Replies with Pong!",
		name: "ping",
	},
	execute: vi.fn(),
};
