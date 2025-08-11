import type { SlashCommandSubcommandBuilder } from "discord.js";
import { vi } from "vitest";
import { mock } from "vitest-mock-extended";

export const PingCommand = vi.fn(() => ({
	autocomplete: vi.fn(),
	data: mock<SlashCommandSubcommandBuilder>({
		description: "A pong command",
		name: "ping",
		toJSON: vi.fn(() => ({
			description: "A pong command",
			name: "ping",
			options: [],
			type: 1,
		})),
	}),
	execute: vi.fn(),
}));
