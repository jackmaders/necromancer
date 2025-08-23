import type { AvailabilityStatus } from "prisma/generated/prisma-client-js";
import { prisma } from "@/shared/model";

export const availabilityRepository = {
	/**
	 * Creates a new poll entry in the database.
	 */
	async createPoll(
		teamId: string,
		messageId: string,
		channelId: string,
		weekStartDate: Date,
	) {
		return await prisma.poll.create({
			data: {
				channelId,
				messageId,
				teamId,
				weekStartDate,
			},
		});
	},

	/**
	 * Updates or creates a player's availability for a specific day in a poll.
	 */
	async upsertAvailability(
		pollId: string,
		playerPrismaId: string,
		day: number,
		status: AvailabilityStatus,
	) {
		return await prisma.availability.upsert({
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
	},
};
