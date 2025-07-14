import { vi } from "vitest";

const lruCache = {
	delete: vi.fn(),
	get: vi.fn(),
	set: vi.fn(),
};

// biome-ignore lint/style/useNamingConvention: Matching the original code style
export const LRUCache = vi.fn(() => lruCache);
