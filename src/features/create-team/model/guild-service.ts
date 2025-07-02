import { guildRepository } from "../api/guild-repository.ts";

export const guildService = {
	/**
	 * Ensures that a guild record exists in the database.
	 * @param guildId The Discord ID of the guild to ensure existence for.
	 * @returns The full guild entity from the database.
	 */
	async ensureExists(guildId: string) {
		return await guildRepository.findOrCreate(guildId);
	},
};
