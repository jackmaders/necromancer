import type { Team } from "prisma/generated/prisma-client-js";

const teamCache = new Map<string, Team[]>();

export const teamCacheManager = {
	/**
	 * Retrieves a list of teams for a guild from the cache.
	 */
	get(guildId: string): Team[] | undefined {
		return teamCache.get(guildId);
	},

	/**
	 * Deletes the cache for a specific guild.
	 * This is used when teams are created or deleted.
	 */
	invalidate(guildId: string): void {
		teamCache.delete(guildId);
	},

	/**
	 * Stores a list of teams for a guild in the cache.
	 */
	set(guildId: string, teams: Team[]): void {
		teamCache.set(guildId, teams);
	},
};
