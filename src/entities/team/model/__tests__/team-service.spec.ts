import { LRUCache } from "lru-cache";
import type { Guild, Team } from "prisma/generated/prisma-client-js";
import { PrismaClientKnownRequestError } from "prisma/generated/prisma-client-js/runtime/library";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";
import { teamRepository } from "../../api/team-repository.ts";
import {
	TeamAlreadyExistsError,
	TeamDoesNotExistError,
} from "../errors/index.ts";
import { guildService } from "../guild-service.ts";
import { teamService } from "../team-service.ts";

vi.mock("../../api/team-repository.ts");
vi.mock("../guild-service.ts");
vi.mock("../team-cache.ts");
vi.mock("lru-cache");

describe("Team Service", () => {
	let team: MockProxy<Team>;
	let guild: MockProxy<Guild>;

	beforeEach(() => {
		team = mock<Team>();
		guild = mock<Guild>();
	});

	const cache = new LRUCache<string, Team[]>({
		max: 100,
		ttl: 60 * 60 * 1000,
	});

	describe("createTeam", () => {
		it("should create a team successfully", async () => {
			vi.mocked(guildService.ensureExists).mockResolvedValue(guild);
			vi.mocked(teamRepository.create).mockResolvedValue(team);

			const result = await teamService.createTeam(team.guildId, team.name);

			expect(guildService.ensureExists).toHaveBeenCalledWith(team.guildId);
			expect(teamRepository.create).toHaveBeenCalledWith(guild.id, team.name);
			expect(cache.delete).toHaveBeenCalledWith(team.guildId);
			expect(result).toEqual(team);
		});

		it("should throw TeamAlreadyExistsError on unique constraint violation", async () => {
			const prismaError = new PrismaClientKnownRequestError("Error", {
				clientVersion: "x",
				code: "P2002",
			});
			vi.mocked(guildService.ensureExists).mockResolvedValue(guild);
			vi.mocked(teamRepository.create).mockRejectedValue(prismaError);

			await expect(
				teamService.createTeam(team.guildId, team.name),
			).rejects.toThrow(new TeamAlreadyExistsError(team.name));
		});

		it("should re-throw other errors when creating a team", async () => {
			const otherError = new Error("Some other database error");
			vi.mocked(guildService.ensureExists).mockResolvedValue(guild);
			vi.mocked(teamRepository.create).mockRejectedValue(otherError);

			await expect(
				teamService.createTeam(team.guildId, team.name),
			).rejects.toThrow(otherError);
		});
	});

	describe("deleteTeam", () => {
		it("should delete a team successfully", async () => {
			vi.mocked(guildService.ensureExists).mockResolvedValue(guild);
			await teamService.deleteTeam(team.guildId, team.name);

			expect(teamRepository.deleteByName).toHaveBeenCalledWith(
				guild.id,
				team.name,
			);
			expect(cache.delete).toHaveBeenCalledWith(team.guildId);
		});

		it("should throw TeamDoesNotExistError on operation failure", async () => {
			vi.mocked(guildService.ensureExists).mockResolvedValue(guild);
			const error = new PrismaClientKnownRequestError("Error", {
				clientVersion: "x",
				code: "P2025",
			});

			vi.mocked(teamRepository.deleteByName).mockRejectedValue(error);

			await expect(
				teamService.deleteTeam(team.guildId, team.name),
			).rejects.toThrow(TeamDoesNotExistError);
		});

		it("should re-throw other errors when deleting a team", async () => {
			vi.mocked(guildService.ensureExists).mockResolvedValue(guild);
			const error = new Error("Some other database error");
			vi.mocked(teamRepository.deleteByName).mockRejectedValue(error);

			await expect(
				teamService.deleteTeam(team.guildId, team.name),
			).rejects.toThrow(error);
		});
	});

	describe("getTeamsByGuildId", () => {
		it("should find teams successfully", async () => {
			vi.mocked(guildService.ensureExists).mockResolvedValue(guild);
			await teamService.getTeamsByGuildId(guild.guildId);

			expect(teamRepository.findAllByGuildId).toHaveBeenCalledWith(guild.id);
			expect(cache.get).toHaveBeenCalledWith(guild.guildId);
		});

		it("should find teams successfully from the cache", async () => {
			vi.mocked(cache.get).mockResolvedValue([team]);
			vi.mocked(guildService.ensureExists).mockResolvedValue(guild);
			await teamService.getTeamsByGuildId(guild.guildId);

			expect(teamRepository.findAllByGuildId).not.toHaveBeenCalledWith(
				guild.id,
			);
		});

		it("should re-throw other errors when deleting a team", async () => {
			vi.mocked(guildService.ensureExists).mockResolvedValue(guild);
			const error = new Error("Some other database error");
			vi.mocked(teamRepository.findAllByGuildId).mockRejectedValue(error);

			await expect(
				teamService.getTeamsByGuildId(guild.guildId),
			).rejects.toThrow(error);
		});
	});

	describe("getTeamByName", () => {
		it("should find team successfully", async () => {
			vi.mocked(guildService.ensureExists).mockResolvedValue(guild);
			await teamService.getTeamByName(guild.guildId, team.name);

			expect(teamRepository.findByName).toHaveBeenCalledWith(
				guild.id,
				team.name,
			);
			expect(cache.get).toHaveBeenCalledWith(guild.guildId);
		});

		it("should find team successfully from the cache", async () => {
			vi.mocked(cache.get).mockReturnValue([team]);
			vi.mocked(guildService.ensureExists).mockResolvedValue(guild);
			await teamService.getTeamByName(guild.guildId, team.name);

			expect(teamRepository.findByName).not.toHaveBeenCalledWith(
				guild.id,
				team.name,
			);
		});

		it("should throw TeamDoesNotExistError on operation failure", async () => {
			vi.mocked(guildService.ensureExists).mockResolvedValue(guild);
			const error = new PrismaClientKnownRequestError("Error", {
				clientVersion: "x",
				code: "P2025",
			});

			vi.mocked(teamRepository.findByName).mockRejectedValue(error);

			await expect(
				teamService.getTeamByName(team.guildId, team.name),
			).rejects.toThrow(new TeamDoesNotExistError(team.name));
		});

		it("should re-throw other errors when deleting a team", async () => {
			vi.mocked(guildService.ensureExists).mockResolvedValue(guild);
			const error = new Error("Some other database error");
			vi.mocked(teamRepository.findByName).mockRejectedValue(error);

			await expect(
				teamService.getTeamByName(guild.guildId, team.name),
			).rejects.toThrow(error);
		});
	});
});
