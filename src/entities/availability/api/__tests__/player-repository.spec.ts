import { describe, expect, it, vi } from "vitest";
import { prisma } from "@/shared/model";
import { playerRepository } from "../player-repository.ts";

vi.mock("@/shared/model", () => ({
	prisma: {
		player: {
			upsert: vi.fn(),
		},
	},
}));

describe("playerRepository", () => {
	describe("findOrCreatePlayer", () => {
		it("should call prisma.player.upsert with correct arguments", async () => {
			const discordId = "discord-123";

			await playerRepository.findOrCreatePlayer(discordId);

			expect(prisma.player.upsert).toHaveBeenCalledWith({
				create: { discordId },
				update: {},
				where: { discordId },
			});
		});
	});
});
