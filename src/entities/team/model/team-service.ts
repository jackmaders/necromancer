import {
	PrismaOperationFailedError,
	PrismaUniqueConstraintError,
	parsePrismaError,
} from "@/shared/model";
import { teamRepository } from "../api/team-repository.ts";
import {
	TeamAlreadyExistsError,
	TeamDoesNotExistError,
} from "./errors/index.ts";
import { guildService } from "./guild-service.ts";

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
	 * Deletes an existing team by its name within a specific Discord guild.
	 */
	async deleteTeam(discordGuildId: string, name: string) {
		const guild = await guildService.ensureExists(discordGuildId);
		try {
			return await teamRepository.deleteByName(guild.id, name);
		} catch (error) {
			if (parsePrismaError(error) instanceof PrismaOperationFailedError) {
				throw new TeamDoesNotExistError(name);
			}

			throw error;
		}
	},

	/**
	 * Finds a team by its name within a specific Discord guild.
	 * @throws {TeamDoesNotExistError} If no team with that name is found.
	 */
	async getTeamByName(discordGuildId: string, name: string) {
		const guild = await guildService.ensureExists(discordGuildId);
		try {
			return await teamRepository.findByName(guild.id, name);
		} catch (error) {
			// P2025 is the error code for "record not found"
			if (parsePrismaError(error) instanceof PrismaOperationFailedError) {
				throw new TeamDoesNotExistError(name);
			}
			throw error;
		}
	},

	/**
	 * Retrieves all teams within a specific Discord guild.
	 */
	async getTeamsByGuildId(discordGuildId: string) {
		const guild = await guildService.ensureExists(discordGuildId);
		return await teamRepository.findAllByGuildId(guild.id);
	},
};
