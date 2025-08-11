import { vi } from "vitest";

const loggerClient = {
	debug: vi.fn(),
	error: vi.fn(),
	info: vi.fn(),
	init: vi.fn(),
	warn: vi.fn(),
};

export const LoggerClient = vi.fn(() => loggerClient);

export const logger = new LoggerClient();
