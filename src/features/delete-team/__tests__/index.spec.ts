import {
	type AutocompleteInteraction,
	type ChatInputCommandInteraction,
	MessageFlags,
} from "discord.js";
import type { Guild, Team } from "prisma/generated/prisma-client-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";
import { TeamDoesNotExistError, teamService } from "@/entities/team/index.ts";
import { GuildOnlyError } from "@/shared/model";
import { deleteTeamSubcommand } from "..";

vi.mock("@/entities/team/index.ts");
vi.mock("@/shared/ui");

describe("Delete Team Subcommand", () => {
	describe("execute", () => {
		let interaction: MockProxy<ChatInputCommandInteraction>;
		let team: MockProxy<Team>;
		let guild: MockProxy<Guild>;

		beforeEach(() => {
			team = mock<Team>();
			guild = mock<Guild>();
			interaction = mock<ChatInputCommandInteraction>();
			interaction.guildId = guild.id;
			interaction.options.getString = vi.fn().mockReturnValue(team.name);
		});

		it("should warn the user if the command is not used in a guild", async () => {
			expect.assertions(1);
			interaction.guildId = null;

			await expect(() =>
				deleteTeamSubcommand.execute(interaction),
			).rejects.toThrow(GuildOnlyError);
		});

		it("should delete a team and reply with a success message", async () => {
			await deleteTeamSubcommand.execute(interaction);

			expect(teamService.deleteTeam).toHaveBeenCalledWith(guild.id, team.name);
			expect(interaction.reply).toHaveBeenCalledWith({
				content: `Team "${team.name}" has been successfully deleted!`,
				flags: [MessageFlags.Ephemeral],
			});
		});

		it("should handle cases where the team already exists", async () => {
			const teamNotExistError = new TeamDoesNotExistError(team.name);
			vi.mocked(teamService.deleteTeam).mockRejectedValueOnce(
				teamNotExistError,
			);

			await expect(() =>
				deleteTeamSubcommand.execute(interaction),
			).rejects.toThrow(TeamDoesNotExistError);
		});

		it("should re-throw unexpected errors", async () => {
			const unexpectedError = new Error("Something went wrong!");
			vi.mocked(teamService.deleteTeam).mockRejectedValueOnce(unexpectedError);

			await expect(deleteTeamSubcommand.execute(interaction)).rejects.toThrow(
				unexpectedError,
			);
		});
	});

	describe("autocomplete", () => {
		let interaction: MockProxy<AutocompleteInteraction>;

		let guild: MockProxy<Guild>;

		beforeEach(() => {
			guild = mock<Guild>();
			interaction = mock<AutocompleteInteraction>();
			interaction.guildId = guild.guildId;
			interaction.options.getFocused = vi.fn().mockReturnValue("team");
		});

		it("should throw GuildOnlyError if not in a guild", async () => {
			interaction.guildId = null;

			expect(deleteTeamSubcommand.autocomplete).toBeDefined();

			await expect(() =>
				deleteTeamSubcommand.autocomplete?.(interaction as never),
			).rejects.toThrow(GuildOnlyError);
		});

		it("should return filtered team names", async () => {
			const teams = [
				{ name: "Team A" },
				{ name: "Team B" },
				{ name: "Another Team" },
			];
			vi.mocked(teamService.getTeamsByGuildId).mockResolvedValue(
				teams as never,
			);

			await deleteTeamSubcommand.autocomplete?.(interaction);

			expect(teamService.getTeamsByGuildId).toHaveBeenCalledWith(guild.guildId);
			expect(interaction.respond).toHaveBeenCalledWith([
				{ name: "team a", value: "team a" },
				{ name: "team b", value: "team b" },
			]);
		});

		it("should limit results to 25", async () => {
			const teams = Array.from({ length: 30 }, (_, i) => ({
				name: `team ${i}`,
			}));
			vi.mocked(teamService.getTeamsByGuildId).mockResolvedValue(
				teams as never,
			);

			await deleteTeamSubcommand.autocomplete?.(interaction as never);

			const respondedOptions = vi.mocked(interaction.respond).mock.calls[0][0];
			expect(respondedOptions.length).toBe(25);
		});
	});
});
