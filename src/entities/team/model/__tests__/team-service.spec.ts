import type { Team } from "prisma/generated/prisma-client-js";
import { PrismaClientKnownRequestError } from "prisma/generated/prisma-client-js/runtime/library.js";
import { describe, expect, it, vi } from "vitest";
import { teamRepository } from "../../api/team-repository.ts";
import {
	TeamAlreadyExistsError,
	TeamDoesNotExistsError,
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
		vi.mocked(guildService.ensureExists).mockResolvedValue(guild as never);
		vi.mocked(teamRepository.create).mockRejectedValue(prismaError);

		await expect(
			teamService.createTeam(team.guildId, team.name),
		).rejects.toThrow(new TeamAlreadyExistsError(team.name));
	});

	it("should re-throw other errors", async () => {
		const otherError = new Error("Some other database error");
		vi.mocked(guildService.ensureExists).mockResolvedValue(guild);
		vi.mocked(teamRepository.create).mockRejectedValue(otherError);

		await expect(
			teamService.createTeam(team.guildId, team.name),
		).rejects.toThrow(otherError);
	});

	it("should delete a team successfully", async () => {
		vi.mocked(teamRepository.findByName).mockResolvedValue(team);

		await teamService.deleteTeam(team.guildId, team.name);

		expect(teamRepository.delete).toHaveBeenCalledWith(team.id);
	});

	it("should throw TeamDoesNotExistsError on operation failure", async () => {
		const error = new PrismaClientKnownRequestError("Error", {
			clientVersion: "x",
			code: "P2025",
		});

		vi.mocked(teamRepository.findByName).mockRejectedValue(error);

		await expect(
			teamService.deleteTeam(team.guildId, team.name),
		).rejects.toThrow(new TeamDoesNotExistsError(team.name));
	});

	it("should re-throw other errors", async () => {
		const error = new Error("Some other database error");
		vi.mocked(teamRepository.delete).mockRejectedValue(error);
		vi.mocked(teamRepository.findByName).mockResolvedValue(team);

		await expect(
			teamService.deleteTeam(team.guildId, team.name),
		).rejects.toThrow(error);
	});
});
