import { vi } from "vitest";

export const commands = [
	{
		data: { name: "ping" },
		execute: vi.fn(),
	},
];
