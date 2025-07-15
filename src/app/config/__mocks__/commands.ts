import type {
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} from "discord.js";
import { vi } from "vitest";
import { mock } from "vitest-mock-extended";

const slashCommand = {
	autocomplete: vi.fn(),
	data: mock<SlashCommandBuilder>({
		description: "A test command",
		name: "test",
	}),
	execute: vi.fn(),
};

const subcommand = {
	autocomplete: vi.fn(),
	data: mock<SlashCommandSubcommandBuilder>({
		description: "A pong command",
		name: "pong",
	}),
	execute: vi.fn(),
};

const parentCommand = {
	autocomplete: vi.fn(() => subcommand.autocomplete()),
	data: mock<SlashCommandSubcommandBuilder>({
		description: "A ping command",
		name: "ping",
		options: [
			{
				description: subcommand.data.description,
				name: subcommand.data.name,
				type: 1,
			},
		],
	}),
	execute: vi.fn(() => subcommand.execute()),
};

const commands = [slashCommand, parentCommand];

export const getCommands = vi.fn(() => {
	return commands;
});
