import type { AvailabilityStatus } from "prisma/generated/prisma-client-js/index";

import { getUpcomingMonday } from "@/shared/lib";
import { availabilityRepository } from "../api/availability-repository.ts";
import { playerService } from "./player-service.ts";

export const availabilityService = {
	/**
	 * Creates a poll record in the database and returns it.
	 */
	async createPoll(teamId: string, messageId: string, channelId: string) {
		const weekStartDate = getUpcomingMonday();
		const poll = await availabilityRepository.createPoll(
			teamId,
			messageId,
			channelId,
			weekStartDate,
		);

		return poll;
	},

	/**
	 * Creates a poll record in the database and returns it.
	 */
	async findPollByMessageId(messageId: string) {
		return await availabilityRepository.findPollByMessageId(messageId);
	},

	/**
	 * Handles an availability vote from a Discord poll,
	 * updating the database accordingly.
	 */
	async handleVote(
		pollPrismaId: string,
		playerDiscordId: string,
		dayIndex: number,
		status: AvailabilityStatus,
	) {
		const player = await playerService.ensureExists(playerDiscordId);

		const poll = await availabilityRepository.getPollById(pollPrismaId);

		await availabilityRepository.upsertAvailability(
			poll.id,
			player.id,
			dayIndex,
			status,
		);
	},
};
