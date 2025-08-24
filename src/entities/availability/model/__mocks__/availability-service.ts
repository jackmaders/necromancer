import { vi } from "vitest";

export const availabilityService = {
	createPoll: vi.fn(),
	findPollByMessageId: vi.fn(),
	handleVote: vi.fn(),
};
