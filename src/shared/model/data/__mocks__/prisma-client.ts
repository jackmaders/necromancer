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

const player = {
	upsert: vi.fn(),
};

const poll = {
	create: vi.fn(),
	findUnique: vi.fn(),
	findUniqueOrThrow: vi.fn(),
};

const availability = {
	upsert: vi.fn(),
};

export const prisma = { availability, guild, player, poll, team };
