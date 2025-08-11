import {
	type AutocompleteInteraction,
	type ChatInputCommandInteraction,
	MessageFlags,
} from "discord.js";
import type { Guild, Team } from "prisma/generated/prisma-client-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";
import { TeamDoesNotExistError, teamService } from "@/entities/team/index.ts";
import { mockGuild, mockTeam } from "@/fixtures/prisma";
import { GuildOnlyError } from "@/shared/model";
import { TeamDeleteSubcommand } from "..";

vi.mock("@/entities/team/index.ts");
vi.mock("@/shared/ui");

describe("Delete Team Subcommand", () => {
	describe("execute", () => {
		let command = new TeamDeleteSubcommand();
		let interaction: MockProxy<ChatInputCommandInteraction>;
		let team: MockProxy<Team>;
		let guild: MockProxy<Guild>;

		beforeEach(() => {
			command = new TeamDeleteSubcommand();
			team = mock<Team>(mockTeam);
			guild = mock<Guild>(mockGuild);
			interaction = mock<ChatInputCommandInteraction>();
			interaction.guildId = guild.id;
			interaction.options.getString = vi.fn().mockReturnValue(team.name);
		});

		it("should warn the user if the command is not used in a guild", async () => {
			expect.assertions(1);
			interaction.guildId = null;

			await expect(() => command.execute(interaction)).rejects.toThrow(
				GuildOnlyError,
			);
		});

		it("should delete a team and reply with a success message", async () => {
			await command.execute(interaction);

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

			await expect(() => command.execute(interaction)).rejects.toThrow(
				TeamDoesNotExistError,
			);
		});

		it("should re-throw unexpected errors", async () => {
			const unexpectedError = new Error("Something went wrong!");
			vi.mocked(teamService.deleteTeam).mockRejectedValueOnce(unexpectedError);

			await expect(command.execute(interaction)).rejects.toThrow(
				unexpectedError,
			);
		});
	});

	describe("autocomplete", () => {
		let command = new TeamDeleteSubcommand();
		let interaction: MockProxy<AutocompleteInteraction>;
		let guild: MockProxy<Guild>;

		beforeEach(() => {
			command = new TeamDeleteSubcommand();
			guild = mock<Guild>(mockGuild);
			interaction = mock<AutocompleteInteraction>();
			interaction.guildId = guild.guildId;
			interaction.options.getFocused = vi.fn().mockReturnValue("team");
		});

		it("should throw GuildOnlyError if not in a guild", async () => {
			interaction.guildId = null;

			expect(command.autocomplete).toBeDefined();

			await expect(() => command.autocomplete?.(interaction)).rejects.toThrow(
				GuildOnlyError,
			);
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

			await command.autocomplete?.(interaction);

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

			await command.autocomplete?.(interaction);

			const respondedOptions = vi.mocked(interaction.respond).mock.calls[0][0];
			expect(respondedOptions.length).toBe(25);
		});
	});
});
