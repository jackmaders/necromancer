import { describe, expect, it, vi } from "vitest";
import { prisma } from "@/shared/model";
import { teamRepository } from "../team-repository.ts";

vi.mock("@/shared/model/data/prisma-client.ts");

describe("Team Repository", () => {
	it("should call prisma.team.create with the correct parameters", async () => {
		const guildDbId = "test-guild-db-id";
		const teamName = "Test Team";
		await teamRepository.create(guildDbId, teamName);

		expect(prisma.team.create).toHaveBeenCalledWith({
			data: {
				guildId: guildDbId,
				name: teamName,
			},
		});
	});
});
