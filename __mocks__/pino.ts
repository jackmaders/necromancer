import { vi } from "vitest";

const logger = {
	debug: vi.fn(),
	error: vi.fn(),
	info: vi.fn(),
	warn: vi.fn(),
};
export const pino = vi.fn(() => logger);

// biome-ignore lint/suspicious/noExplicitAny: Need to set static property
(pino as any).stdTimeFunctions = {
	isoTime: vi.fn(),
};
