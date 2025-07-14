import type { Poll } from "prisma/generated/prisma-client-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";
import { prisma } from "@/shared/model";
import { availabilityRepository } from "../availability-repository.ts";

vi.mock("@/shared/model/data/prisma-client.ts");

describe("Availability Repository", () => {
	let poll: MockProxy<Poll>;

	beforeEach(() => {
		poll = mock<Poll>();
	});

	describe("createPoll", () => {
		it("should call prisma.poll.create with the correct parameters", async () => {
			const teamId = "test-team-id";
			const weekStartDate = new Date();
			vi.mocked(prisma.poll.create).mockResolvedValue(poll);

			const result = await availabilityRepository.createPoll(
				teamId,
				weekStartDate,
			);

			expect(prisma.poll.create).toHaveBeenCalledWith({
				data: {
					teamId,
					weekStartDate,
				},
			});
			expect(result).toEqual(poll);
		});
	});

	describe("updateMessageId", () => {
		it("should call prisma.poll.update with the correct parameters", async () => {
			const pollId = "test-poll-id";
			const messageId = "test-message-id";
			vi.mocked(prisma.poll.update).mockResolvedValue(poll);

			const result = await availabilityRepository.updateMessageId(
				pollId,
				messageId,
			);

			expect(prisma.poll.update).toHaveBeenCalledWith({
				data: { messageId },
				where: { id: pollId },
			});
			expect(result).toEqual(poll);
		});
	});
});
