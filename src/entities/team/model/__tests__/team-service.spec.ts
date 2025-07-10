import type { Team } from "prisma/generated/prisma-client-js";
import { PrismaClientKnownRequestError } from "prisma/generated/prisma-client-js/runtime/library";
import { describe, expect, it, vi } from "vitest";
import { teamRepository } from "../../api/team-repository.ts";
import {
	TeamAlreadyExistsError,
	TeamDoesNotExistError,
} from "../errors/index.ts";
import { guildService } from "../guild-service.ts";
import { teamService } from "../team-service.ts";

vi.mock("../../api/team-repository.ts");
vi.mock("../guild-service.ts");

const guild = {
	createdAt: new Date(),
	guildId: "test-guild-db-id",
	id: "test-db-guild-id",
	updatedAt: new Date(),
};
const team: Team = {
	createdAt: new Date(),
	guildId: guild.guildId,
	id: "test-team-id",
	name: "Test Team",
	updatedAt: new Date(),
};

describe("Team Service", () => {
	it("should create a team successfully", async () => {
		vi.mocked(guildService.ensureExists).mockResolvedValue(guild);
		vi.mocked(teamRepository.create).mockResolvedValue(team);

		const result = await teamService.createTeam(team.guildId, team.name);

		expect(guildService.ensureExists).toHaveBeenCalledWith(team.guildId);
		expect(teamRepository.create).toHaveBeenCalledWith(guild.id, team.name);
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

	it("should delete a team successfully", async () => {
		vi.mocked(guildService.ensureExists).mockResolvedValue(guild);
		await teamService.deleteTeam(team.guildId, team.name);

		expect(teamRepository.deleteByName).toHaveBeenCalledWith(
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

		vi.mocked(teamRepository.deleteByName).mockRejectedValue(error);

		await expect(
			teamService.deleteTeam(team.guildId, team.name),
		).rejects.toThrow(new TeamDoesNotExistError(team.name));
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
