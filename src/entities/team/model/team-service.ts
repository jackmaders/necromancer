import { guildService } from "@/entities/guild/@x/team.ts";
import {
	PrismaOperationFailedError,
	PrismaUniqueConstraintError,
	parsePrismaError,
} from "@/shared/model";
import { teamRepository } from "../api/team-repository.ts";
import {
	TeamAlreadyExistsError,
	TeamDoesNotExistsError,
} from "./errors/index.ts";

export const teamService = {
	/**
	 * Creates a new team.
	 * If the relevant guild does not exist, it also be created.
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

	/**
	 * Deletes an existing team.
	 */
	async deleteTeam(discordGuildId: string, name: string) {
		try {
			const team = await teamRepository.findByName(discordGuildId, name);
			return await teamRepository.delete(team.id);
		} catch (error) {
			if (parsePrismaError(error) instanceof PrismaOperationFailedError) {
				throw new TeamDoesNotExistsError(name);
			}

			throw error;
		}
	},
};
