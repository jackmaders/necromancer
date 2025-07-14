import { vi } from "vitest";

const commands = [
	{
		autocomplete: vi.fn(),
		data: { name: "ping" },
		execute: vi.fn(),
	},
];

export function getCommands() {
	return commands;
}
