import { vi } from "vitest";

const login = vi.fn();
const once = vi.fn();

export const discordClient = {
	login,
	once,
};
