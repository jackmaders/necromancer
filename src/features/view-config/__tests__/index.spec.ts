import type { Team } from "prisma/generated/prisma-client-js";
import { describe, expect, it, vi } from "vitest";
import { teamService } from "@/entities/team/index.ts";
import { viewConfigSubcommand } from "@/features/view-config/index.ts";
import { GuildOnlyError } from "@/shared/model/index.ts";
import { InteractionBuilder } from "@/testing/interaction-builder.ts";
import { replyWithGuildConfig } from "../ui/replies.ts";

vi.mock("@/entities/team/index.ts");
vi.mock("../ui/replies.ts");
vi.mock("@/shared/ui");

const guild = {
	createdAt: new Date(),
	guildId: "test-guild-db-id",
	id: "test-db-guild-id",
	updatedAt: new Date(),
};
const team: Team = {
	createdAt: new Date(),
	guildId: guild.id,
	id: "test-team-id",
	name: "Test Team",
	updatedAt: new Date(),
};

describe("View Config Subcommand", () => {
	it("should warn the user if the command is not used in a guild", async () => {
		const interaction = new InteractionBuilder("team").build();
		interaction.guildId = null;

		await expect(() =>
			viewConfigSubcommand.execute(interaction),
		).rejects.toThrow(GuildOnlyError);
	});

	it("should create a team and reply with a success message", async () => {
		vi.mocked(teamService.getTeamsByGuildId).mockResolvedValue([team]);
		const interaction = new InteractionBuilder("team")
			.with({
				guildId: guild.guildId,
			})
			.build();

		await viewConfigSubcommand.execute(interaction);

		expect(teamService.getTeamsByGuildId).toHaveBeenCalledWith(guild.guildId);
		expect(replyWithGuildConfig).toHaveBeenCalledWith(interaction, {
			teams: [team],
		});
	});

	it("should handle cases where no teams exists", async () => {
		vi.mocked(teamService.getTeamsByGuildId).mockResolvedValue([]);
		const interaction = new InteractionBuilder("team")
			.with({
				guildId: guild.guildId,
			})
			.build();

		await viewConfigSubcommand.execute(interaction);

		expect(teamService.getTeamsByGuildId).toHaveBeenCalledWith(guild.guildId);
		expect(replyWithGuildConfig).toHaveBeenCalledWith(interaction, {
			teams: [],
		});
	});

	it("should re-throw unexpected errors", async () => {
		const error = new Error("Unexpected error");
		vi.mocked(teamService.getTeamsByGuildId).mockRejectedValue(error);
		const interaction = new InteractionBuilder("team")
			.with({
				guildId: guild.guildId,
			})
			.build();

		await expect(viewConfigSubcommand.execute(interaction)).rejects.toThrow(
			error,
		);
	});
});
