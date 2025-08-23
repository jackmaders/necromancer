import { AvailabilityStatus } from "prisma/generated/prisma-client-js";
import { describe, expect, it, vi } from "vitest";
import { prisma } from "@/shared/model";
import { availabilityRepository } from "../availability-repository.ts";

vi.mock("@/shared/model/data/prisma-client.ts");

describe("availabilityRepository", () => {
	describe("createPoll", () => {
		it("should call prisma.poll.create with correct arguments", async () => {
			const teamId = "team-123";
			const messageId = "message-123";
			const channelId = "channel-123";
			const weekStartDate = new Date();

			await availabilityRepository.createPoll(
				teamId,
				messageId,
				channelId,
				weekStartDate,
			);

			expect(prisma.poll.create).toHaveBeenCalledWith({
				data: {
					channelId,
					messageId,
					teamId,
					weekStartDate,
				},
			});
		});
	});

	describe("getPollById", () => {
		it("should call prisma.poll.findUniqueOrThrow with correct arguments", async () => {
			const id = "poll-123";

			await availabilityRepository.getPollById(id);

			expect(prisma.poll.findUniqueOrThrow).toHaveBeenCalledWith({
				where: { id },
			});
		});
	});

	describe("getPollByMessageId", () => {
		it("should call prisma.poll.findUniqueOrThrow with correct arguments", async () => {
			const messageId = "message-123";

			await availabilityRepository.findPollByMessageId(messageId);

			expect(prisma.poll.findUnique).toHaveBeenCalledWith({
				where: { messageId },
			});
		});
	});

	describe("upsertAvailability", () => {
		it("should call prisma.availability.upsert with correct arguments", async () => {
			const pollId = "poll-123";
			const playerPrismaId = "player-123";
			const day = 1;
			const status = AvailabilityStatus.Available;

			await availabilityRepository.upsertAvailability(
				pollId,
				playerPrismaId,
				day,
				status,
			);

			expect(prisma.availability.upsert).toHaveBeenCalledWith({
				create: {
					day,
					playerId: playerPrismaId,
					pollId,
					status,
				},
				update: { status },
				where: {
					// biome-ignore lint/style/useNamingConvention: indexes are snake_case
					pollId_playerId_day: {
						day,
						playerId: playerPrismaId,
						pollId,
					},
				},
			});
		});
	});
});
