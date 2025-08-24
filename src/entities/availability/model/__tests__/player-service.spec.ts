import type { Player } from "prisma/generated/prisma-client-js/index";
import { describe, expect, it, vi } from "vitest";
import { mock } from "vitest-mock-extended";
import { playerRepository } from "@/entities/availability/api/player-repository";
import { playerService } from "../player-service.ts";

vi.mock("@/entities/availability/api/player-repository");

describe("playerService", () => {
	describe("ensureExists", () => {
		it("should call playerRepository.findOrCreatePlayer with the provided discordId", async () => {
			const discordId = "test-discord-id";
			const mockPlayer = mock<Player>();
			vi.mocked(playerRepository.findOrCreatePlayer).mockResolvedValue(
				mockPlayer,
			);

			const result = await playerService.ensureExists(discordId);

			expect(playerRepository.findOrCreatePlayer).toHaveBeenCalledWith(
				discordId,
			);
			expect(result).toEqual(mockPlayer);
		});
	});
});
