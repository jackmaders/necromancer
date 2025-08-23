/** biome-ignore-all lint/style/useNamingConvention: Mirroring existing module */
import { vi } from "vitest";

const pingCommandData = {
	description: "A pong command",
	name: "ping",
	options: [],
};
export const PingCommand = vi.fn(() => ({
	autocomplete: vi.fn(),
	data: {
		...pingCommandData,
		toJSON: vi.fn(() => ({ ...pingCommandData, type: 1 })),
	},
	execute: vi.fn(),
}));

const teamCreateCommandData = {
	description: "Create a team",
	name: "create",
	type: 1,
};
const teamCommandData = {
	description: "Manage teams",
	name: "team",
	options: [teamCreateCommandData],
};
export const TeamCommand = vi.fn(() => ({
	autocomplete: vi.fn(),
	data: {
		...teamCommandData,
		toJSON: vi.fn(() => ({
			...teamCommandData,
		})),
	},
	execute: vi.fn(),
	subcommands: new Map(),
}));

const commands = [new PingCommand(), new TeamCommand()];

export const getCommands = vi.fn(() => {
	return commands;
});
