import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";
import type { Team } from "prisma/generated/prisma-client-js";
import { describe, expect, it, vi } from "vitest";
import { prisma } from "@/shared/model";
import { teamRepository } from "../team-repository.ts";

vi.mock("@/shared/model/data/prisma-client.ts");

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

describe("Team Repository", () => {
	it("should handle creating a team", async () => {
		expect.assertions(2);
		vi.mocked(prisma.team.create).mockResolvedValue(team);
		const result = await teamRepository.create(team.guildId, team.name);

		expect(result).toEqual(team);
		expect(prisma.team.create).toHaveBeenCalledWith({
			data: {
				guildId: team.guildId,
				name: team.name,
			},
		});
	});

	it("should throw an error if creating an existing team", async () => {
		expect.assertions(2);
		const error = new PrismaClientKnownRequestError(
			"PrismaUniqueConstraintError",
			{
				clientVersion: "",
				code: "P2002",
			},
		);
		vi.mocked(prisma.team.create).mockRejectedValueOnce(error);

		const promise = teamRepository.create(team.guildId, team.name);

		await expect(promise).rejects.toThrow(error);
		expect(prisma.team.create).toHaveBeenCalledWith({
			data: {
				guildId: team.guildId,
				name: team.name,
			},
		});
	});

	it("should handle fetching a team by name", async () => {
		expect.assertions(2);
		vi.mocked(prisma.team.findUniqueOrThrow).mockResolvedValue(team);
		const result = await teamRepository.findByName(team.guildId, team.name);

		expect(result).toEqual(team);
		expect(prisma.team.findUniqueOrThrow).toHaveBeenCalledWith({
			where: {
				// biome-ignore lint/style/useNamingConvention: snake case used for indexes
				guildId_name: {
					guildId: team.guildId,
					name: team.name,
				},
			},
		});
	});

	it("should throw an error if fetching a non-existent team by name", async () => {
		expect.assertions(2);
		const error = new PrismaClientKnownRequestError(
			"PrismaOperationFailedError",
			{
				clientVersion: "",
				code: "P2025",
			},
		);
		vi.mocked(prisma.team.findUniqueOrThrow).mockRejectedValueOnce(error);

		const promise = teamRepository.findByName(team.guildId, team.name);

		await expect(promise).rejects.toThrow(error);
		expect(prisma.team.findUniqueOrThrow).toHaveBeenCalledWith({
			where: {
				// biome-ignore lint/style/useNamingConvention: snake case used for indexes
				guildId_name: {
					guildId: team.guildId,
					name: team.name,
				},
			},
		});
	});

	it("should handle deleting a team by name", async () => {
		expect.assertions(1);
		await teamRepository.deleteByName(team.guildId, team.name);

		expect(prisma.team.delete).toHaveBeenCalledWith({
			where: {
				// biome-ignore lint/style/useNamingConvention: snake case used for indexes
				guildId_name: {
					guildId: team.guildId,
					name: team.name,
				},
			},
		});
	});

	it("should throw an error if deleting a non-existent team by name", async () => {
		expect.assertions(2);
		const error = new PrismaClientKnownRequestError(
			"PrismaOperationFailedError",
			{
				clientVersion: "",
				code: "P2025",
			},
		);
		vi.mocked(prisma.team.delete).mockRejectedValueOnce(error);

		const promise = teamRepository.deleteByName(team.guildId, team.name);

		await expect(promise).rejects.toThrow(error);
		expect(prisma.team.delete).toHaveBeenCalledWith({
			where: {
				// biome-ignore lint/style/useNamingConvention: snake case used for indexes
				guildId_name: {
					guildId: team.guildId,
					name: team.name,
				},
			},
		});
	});
});
