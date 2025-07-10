import { describe, expect, it, vi } from "vitest";
import { prisma } from "@/shared/model";
import { guildRepository } from "../guild-repository.ts";

vi.mock("@/shared/model/data/prisma-client.ts");

describe("Guild Repository", () => {
	it("should call prisma.guild.upsert with the correct parameters", async () => {
		const guildId = "test-guild-id";
		await guildRepository.findOrCreate(guildId);

		expect(prisma.guild.upsert).toHaveBeenCalledWith({
			create: { guildId },
			update: {},
			where: { guildId },
		});
	});
});
