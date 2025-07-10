import { PrismaUniqueConstraintError, parsePrismaError } from "@/shared/model";
import { teamRepository } from "../api/team-repository.ts";
import { TeamAlreadyExistsError } from "./errors/team-already-exists-error.ts";
import { guildService } from "./guild-service.ts";

export const teamService = {
	/**
	 * Creates a new team. It first ensures the guild exists, then attempts to create the team.
	 * @param discordGuildId The Discord ID of the guild where the team is being created.
	 * @param name The name of the new team.
	 * @throws {TeamAlreadyExistsError} If a team with the given name already exists in the guild.
	 */
	async createTeam(discordGuildId: string, name: string) {
		const guild = await guildService.ensureExists(discordGuildId);

		try {
			return await teamRepository.create(guild.id, name);
		} catch (error) {
			if (parsePrismaError(error) instanceof PrismaUniqueConstraintError) {
				throw new TeamAlreadyExistsError(name);
			}

			throw error;
		}
	},
};
