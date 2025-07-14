import { prisma } from "@/shared/model";

export const availabilityRepository = {
	/**
	 * Creates a new Poll record for a given team and week.
	 */
	async createPoll(teamId: string, weekStartDate: Date) {
		return await prisma.poll.create({
			data: {
				teamId,
				weekStartDate,
			},
		});
	},

	/**
	 * Updates an existing poll with its Discord message ID.
	 */
	async updateMessageId(pollId: string, messageId: string) {
		return await prisma.poll.update({
			data: { messageId },
			where: { id: pollId },
		});
	},
};
