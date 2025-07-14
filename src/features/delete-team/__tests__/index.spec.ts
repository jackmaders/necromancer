import type { ChatInputCommandInteraction } from "discord.js";
import type { Guild, Team } from "prisma/generated/prisma-client-js/index";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";
import { TeamDoesNotExistError, teamService } from "@/entities/team/index.ts";
import { GuildOnlyError } from "@/shared/model";
import { deleteTeamSubcommand } from "..";
import { replyWithTeamDeleted } from "../ui/replies.ts";

vi.mock("@/entities/team/index.ts");
vi.mock("../ui/replies.ts");
vi.mock("@/shared/ui");

describe("Delete Team Subcommand", () => {
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
		expect(replyWithTeamDeleted).toHaveBeenCalledWith(interaction, team.name);
	});

	it("should handle cases where the team already exists", async () => {
		const teamNotExistError = new TeamDoesNotExistError(team.name);
		vi.mocked(teamService.deleteTeam).mockRejectedValueOnce(teamNotExistError);

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
