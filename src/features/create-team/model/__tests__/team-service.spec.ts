import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";
import { describe, expect, it, vi } from "vitest";
import { PrismaUniqueConstraintError, parsePrismaError } from "@/shared/model";
import { teamRepository } from "../../api/team-repository.ts";
import { TeamAlreadyExistsError } from "../errors/team-already-exists-error.ts";
import { guildService } from "../guild-service.ts";
import { teamService } from "../team-service.ts";

vi.mock("../../api/team-repository.ts");
vi.mock("../guild-service.ts");
vi.mock("@/shared/model/data/prisma-errors.ts");

describe("Team Service", () => {
	const discordGuildId = "test-discord-guild-id";
	const teamName = "Test Team";
	const guild = { guildId: discordGuildId, id: "test-db-guild-id" };

	it("should create a team successfully", async () => {
		vi.mocked(guildService.ensureExists).mockResolvedValue(guild as never);
		const expectedTeam = { guildId: guild.id, name: teamName };
		vi.mocked(teamRepository.create).mockResolvedValue(expectedTeam as never);

		const result = await teamService.createTeam(discordGuildId, teamName);

		expect(guildService.ensureExists).toHaveBeenCalledWith(discordGuildId);
		expect(teamRepository.create).toHaveBeenCalledWith(guild.id, teamName);
		expect(result).toEqual(expectedTeam);
	});

	it("should throw TeamAlreadyExistsError on unique constraint violation", async () => {
		const prismaError = new PrismaClientKnownRequestError("Error", {
			clientVersion: "x",
			code: "P2002",
		});
		const uniqueConstraintError = new PrismaUniqueConstraintError(prismaError);
		vi.mocked(guildService.ensureExists).mockResolvedValue(guild as never);
		vi.mocked(teamRepository.create).mockRejectedValue(prismaError);
		vi.mocked(parsePrismaError).mockReturnValue(uniqueConstraintError);

		await expect(
			teamService.createTeam(discordGuildId, teamName),
		).rejects.toThrow(new TeamAlreadyExistsError(teamName));
	});

	it("should re-throw other errors", async () => {
		const otherError = new Error("Some other database error");
		vi.mocked(guildService.ensureExists).mockResolvedValue(guild as never);
		vi.mocked(teamRepository.create).mockRejectedValue(otherError);
		vi.mocked(parsePrismaError).mockReturnValue(null);

		await expect(
			teamService.createTeam(discordGuildId, teamName),
		).rejects.toThrow(otherError);
	});
});
