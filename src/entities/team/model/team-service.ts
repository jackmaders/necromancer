import { LRUCache } from "lru-cache";
import type { Team } from "prisma/generated/prisma-client-js";
import { parsePrismaError } from "@/shared/model";
import { teamRepository } from "../api/team-repository.ts";
import {
	TeamAlreadyExistsError,
	TeamDoesNotExistError,
} from "./errors/index.ts";
import { guildService } from "./guild-service.ts";

const teamCache = new LRUCache<string, Team[]>({
	max: 100,
	ttl: 60 * 60 * 1000,
});

export const teamService = {
	/**
	 * Creates a new team.
	 * If the relevant guild does not exist, it also be created.
	 */
	async createTeam(discordGuildId: string, name: string) {
		const guild = await guildService.ensureExists(discordGuildId);

		try {
			const team = await teamRepository.create(guild.id, name);
			teamCache.delete(discordGuildId);
			return team;
		} catch (error) {
			if (parsePrismaError(error)?.name === "PrismaUniqueConstraintError") {
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
			const team = await teamRepository.deleteByName(guild.id, name);
			teamCache.delete(discordGuildId);
			return team;
		} catch (error) {
			if (parsePrismaError(error)?.name === "PrismaOperationFailedError") {
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
		const cachedTeams = teamCache.get(discordGuildId);
		const cachedTeam = cachedTeams?.find((team) => team.name === name);

		if (cachedTeam) {
			return cachedTeam;
		}

		const guild = await guildService.ensureExists(discordGuildId);
		try {
			return await teamRepository.findByName(guild.id, name);
		} catch (error) {
			if (parsePrismaError(error)?.name === "PrismaOperationFailedError") {
				throw new TeamDoesNotExistError(name);
			}
			throw error;
		}
	},

	/**
	 * Retrieves all teams within a specific Discord guild.
	 */
	async getTeamsByGuildId(discordGuildId: string) {
		const cachedTeams = teamCache.get(discordGuildId);
		if (cachedTeams) {
			return cachedTeams;
		}

		const guild = await guildService.ensureExists(discordGuildId);
		const teams = await teamRepository.findAllByGuildId(guild.id);
		teamCache.set(discordGuildId, teams);
		return teams;
	},
};
