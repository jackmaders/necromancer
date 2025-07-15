import type { Guild, Team } from "prisma/generated/prisma-client-js";

export const mockGuild: Guild = {
	createdAt: new Date(),
	guildId: "guild-db-id",
	id: "guild-id",
	updatedAt: new Date(),
};

export const mockTeam: Team = {
	createdAt: new Date(),
	guildId: mockGuild.guildId,
	id: "team-id",
	name: "Team Name",
	updatedAt: new Date(),
};
