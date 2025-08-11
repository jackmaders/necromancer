import type { ChatInputCommandInteraction } from "discord.js";
import type { Guild, Team } from "prisma/generated/prisma-client-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";
import { teamService } from "@/entities/team/index.ts";
import { viewConfigSubcommand } from "@/features/admin/view/index.ts";
import { mockTeam } from "@/fixtures/prisma.ts";
import { type AppContext, GuildOnlyError } from "@/shared/model/index.ts";
import { buildGuildConfigEmbed } from "../ui/guild-config.ts";

vi.mock("@/entities/team/index.ts");
vi.mock("../ui/guild-config.ts");
vi.mock("@/shared/ui");

describe("View Config Subcommand", () => {
	let interaction: MockProxy<ChatInputCommandInteraction>;
	let context: MockProxy<AppContext>;
	let team: MockProxy<Team>;
	let guild: MockProxy<Guild>;

	beforeEach(() => {
		team = mock<Team>(mockTeam);
		guild = mock<Guild>();
		interaction = mock<ChatInputCommandInteraction>();
		context = mock<AppContext>();
		interaction.guildId = guild.guildId;
	});

	it("should warn the user if the command is not used in a guild", async () => {
		interaction.guildId = null;

		await expect(() =>
			viewConfigSubcommand.execute(interaction, context),
		).rejects.toThrow(GuildOnlyError);
	});

	it("should create a team and reply with a success message", async () => {
		vi.mocked(teamService.getTeamsByGuildId).mockResolvedValue([team]);

		await viewConfigSubcommand.execute(interaction, context);

		expect(teamService.getTeamsByGuildId).toHaveBeenCalledWith(guild.guildId);
		expect(buildGuildConfigEmbed).toHaveBeenCalledWith(interaction, {
			teams: [team],
		});
	});

	it("should handle cases where no teams exists", async () => {
		vi.mocked(teamService.getTeamsByGuildId).mockResolvedValue([]);

		await viewConfigSubcommand.execute(interaction, context);

		expect(teamService.getTeamsByGuildId).toHaveBeenCalledWith(guild.guildId);
		expect(buildGuildConfigEmbed).toHaveBeenCalledWith(interaction, {
			teams: [],
		});
	});

	it("should re-throw unexpected errors", async () => {
		const error = new Error("Unexpected error");
		vi.mocked(teamService.getTeamsByGuildId).mockRejectedValue(error);

		await expect(
			viewConfigSubcommand.execute(interaction, context),
		).rejects.toThrow(error);
	});
});
