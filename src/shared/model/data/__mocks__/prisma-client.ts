import { vi } from "vitest";

const guild = {
	upsert: vi.fn(),
};

const team = {
	create: vi.fn(),
};

export const prisma = { guild, team };
