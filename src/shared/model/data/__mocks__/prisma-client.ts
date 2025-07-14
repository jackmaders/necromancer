import { vi } from "vitest";

const guild = {
	upsert: vi.fn(),
};

const team = {
	create: vi.fn(),
	delete: vi.fn(),
	findMany: vi.fn(),
	findUniqueOrThrow: vi.fn(),
};

export const prisma = { guild, team };
