import type { AvailabilityStatus } from "prisma/generated/prisma-client-js/index";
import { playerService } from "@/entities/player/@x/availability.ts";
import { getUpcomingMonday } from "@/shared/lib";
import { availabilityRepository } from "../api/availability-repository.ts";

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
	 * Handles an availability vote from a Discord poll,
	 * updating the database accordingly.
	 */
	async handleVote(
		_messageId: string,
		_channelId: string,
		playerDiscordId: string,
		day: number,
		status: AvailabilityStatus,
	) {
		const player = await playerService.ensureExists(playerDiscordId);

		// Get the poll from the database
		// TODO: add logic to retrieve the poll record
		// This will be needed when we implement poll creation.
		const pollId = "TBD";

		await availabilityRepository.upsertAvailability(
			pollId,
			player.id,
			day,
			status,
		);
	},
};
