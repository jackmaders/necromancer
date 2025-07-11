import { vi } from "vitest";

export const $ = vi.fn(() => ({
	json: vi.fn(() => ({ version: "1.0.0" })),
	text: vi.fn(() => ""),
}));

export const file = vi.fn(() => ({
	json: vi.fn(() => ({ version: "1.0.0" })),
	text: vi.fn(() => ""),
}));
