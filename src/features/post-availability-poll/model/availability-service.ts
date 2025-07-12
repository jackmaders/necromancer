import { teamService } from "@/entities/team";
import { getUpcomingMonday } from "@/shared/lib/index.ts";
import { availabilityRepository } from "../api/availability-repository.ts";

export const availabilityService = {
	/**
	 * Creates a new availability poll for a given team.
	 * It calculates the upcoming week's start date and creates the database record.
	 * @throws {TeamDoesNotExistError} If the team cannot be found.
	 */
	async createPoll(guildId: string, teamName: string) {
		const team = await teamService.getTeamByName(guildId, teamName);
		const weekStartDate = getUpcomingMonday();

		return availabilityRepository.create(team.id, weekStartDate);
	},

	/**
	 * Sets the Discord message ID for a poll after it has been posted.
	 */
	async setPollMessageId(pollId: string, messageId: string) {
		return await availabilityRepository.updateMessageId(pollId, messageId);
	},
};
