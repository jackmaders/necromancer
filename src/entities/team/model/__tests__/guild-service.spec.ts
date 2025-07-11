import { describe, expect, it, vi } from "vitest";
import { guildRepository } from "../../api/guild-repository.ts";
import { guildService } from "../guild-service.ts";

vi.mock("../../api/guild-repository.ts");

describe("Guild Service", () => {
	describe("ensureExists", () => {
		it("should call the repository to find or create a guild", async () => {
			const guildId = "test-guild-id";
			const expectedGuild = { guildId, id: "1" };
			vi.mocked(guildRepository.findOrCreate).mockResolvedValue(
				expectedGuild as never,
			);

			const result = await guildService.ensureExists(guildId);

			expect(guildRepository.findOrCreate).toHaveBeenCalledWith(guildId);
			expect(result).toEqual(expectedGuild);
		});
	});
});
