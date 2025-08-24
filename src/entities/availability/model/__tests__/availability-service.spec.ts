import {
	AvailabilityStatus,
	type Player,
	type Poll,
} from "prisma/generated/prisma-client-js";
import { describe, expect, it, vi } from "vitest";
import { getUpcomingMonday } from "@/shared/lib";
import { availabilityRepository } from "../../api/availability-repository.ts";
import { availabilityService } from "../availability-service.ts";
import { playerService } from "../player-service.ts";

vi.mock("@/shared/lib");
vi.mock("../../api/availability-repository");
vi.mock("../player-service");

describe("availabilityService", () => {
	describe("createPoll", () => {
		it("should call availabilityRepository.createPoll with correct arguments", async () => {
			const teamId = "team-123";
			const messageId = "message-123";
			const channelId = "channel-123";
			const weekStartDate = new Date();
			vi.mocked(getUpcomingMonday).mockReturnValue(weekStartDate);

			await availabilityService.createPoll(teamId, messageId, channelId);

			expect(getUpcomingMonday).toHaveBeenCalled();
			expect(availabilityRepository.createPoll).toHaveBeenCalledWith(
				teamId,
				messageId,
				channelId,
				weekStartDate,
			);
		});
	});

	describe("getPollByMessageId", () => {
		it("should call availabilityRepository.getPollByMessageId with correct arguments", async () => {
			const messageId = "message-123";

			await availabilityService.findPollByMessageId(messageId);

			expect(availabilityRepository.findPollByMessageId).toHaveBeenCalledWith(
				messageId,
			);
		});
	});

	describe("handleVote", () => {
		it("should call playerService.ensureExists and availabilityRepository.upsertAvailability with correct arguments", async () => {
			const pollPrismaId = "poll-123";
			const playerDiscordId = "discord-123";
			const dayIndex = 1;
			const status = AvailabilityStatus.AVAILABLE;

			const player: Player = {
				createdAt: new Date(),
				discordId: playerDiscordId,
				id: "player-123",
				updatedAt: new Date(),
			};
			const poll: Poll = {
				channelId: "channel-123",
				createdAt: new Date(),
				id: pollPrismaId,
				messageId: "message-123",
				teamId: "team-123",
				updatedAt: new Date(),
				weekStartDate: new Date(),
			};

			vi.mocked(playerService.ensureExists).mockResolvedValue(player);
			vi.mocked(availabilityRepository.getPollById).mockResolvedValue(poll);

			await availabilityService.handleVote(
				pollPrismaId,
				playerDiscordId,
				dayIndex,
				status,
			);

			expect(playerService.ensureExists).toHaveBeenCalledWith(playerDiscordId);
			expect(availabilityRepository.getPollById).toHaveBeenCalledWith(
				pollPrismaId,
			);
			expect(availabilityRepository.upsertAvailability).toHaveBeenCalledWith(
				poll.id,
				player.id,
				dayIndex,
				status,
			);
		});
	});
});
