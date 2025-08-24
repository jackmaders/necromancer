import { vi } from "vitest";

const logger = {
	debug: vi.fn(),
	error: vi.fn(),
	info: vi.fn(),
	warn: vi.fn(),
};
export const pino = vi.fn(() => logger);

export const stdTimeFunctions = {
	isoTime: vi.fn(),
};
