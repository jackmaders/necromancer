import { vi } from "vitest";

const data = {
	description: "Replies with Pong!",
	name: "ping",
};

export class PingCommand {
	data = {
		...data,
		// biome-ignore lint/style/useNamingConvention: Mirroring existing module
		toJSON: vi.fn(() => data),
	};
	execute = vi.fn();
}
