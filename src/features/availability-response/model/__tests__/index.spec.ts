import type { Message, PollAnswer } from "discord.js";
import type { Poll } from "prisma/generated/prisma-client-js";
import { AvailabilityStatus } from "prisma/generated/prisma-client-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";
import { availabilityService } from "@/entities/availability/model/availability-service.ts";
import { handleAvailabilityResponse } from "..";

vi.mock("@/entities/availability/model/availability-service.ts");

describe("handleAvailabilityResponse", () => {
	let pollAnswer = mock<PollAnswer>();
	let message = mock<Message>();
	let poll = mock<Poll>();

	beforeEach(() => {
		poll = mock<Poll>();
		pollAnswer = mock<PollAnswer>();
		message = mock<Message>();
		(pollAnswer.poll.message as unknown) = message;
	});

	it("should handle a vote against an untracked poll", async () => {
		vi.mocked(availabilityService.findPollByMessageId).mockResolvedValue(null);

		await handleAvailabilityResponse([pollAnswer, "player-123"]);

		expect(availabilityService.findPollByMessageId).toHaveBeenCalledWith(
			pollAnswer.poll.message.id,
		);
		expect(availabilityService.handleVote).not.toHaveBeenCalled();
	});

	it("should handle a vote against a tracked poll", async () => {
		vi.mocked(availabilityService.findPollByMessageId).mockResolvedValue(poll);

		await handleAvailabilityResponse([pollAnswer, "player-123"]);

		expect(availabilityService.findPollByMessageId).toHaveBeenCalledWith(
			pollAnswer.poll.message.id,
		);
		expect(availabilityService.handleVote).toHaveBeenCalledWith(
			poll.id,
			"player-123",
			pollAnswer.id - 1,
			AvailabilityStatus.AVAILABLE,
		);
	});
});
