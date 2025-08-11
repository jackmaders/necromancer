import { type ChatInputCommandInteraction, MessageFlags } from "discord.js";
import type { Guild, Team } from "prisma/generated/prisma-client-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";
import { TeamAlreadyExistsError, teamService } from "@/entities/team/index.ts";
import { mockGuild, mockTeam } from "@/fixtures/prisma";
import { type AppContext, GuildOnlyError } from "@/shared/model";
import { createTeamSubcommand } from "..";

vi.mock("@/entities/team/index.ts");
vi.mock("@/shared/ui");

describe("Create Team Subcommand", () => {
	let interaction: MockProxy<ChatInputCommandInteraction>;
	let context: MockProxy<AppContext>;
	let team: MockProxy<Team>;
	let guild: MockProxy<Guild>;

	beforeEach(() => {
		team = mock<Team>(mockTeam);
		guild = mock<Guild>(mockGuild);
		interaction = mock<ChatInputCommandInteraction>();
		context = mock<AppContext>();
		interaction.guildId = guild.id;
		interaction.commandName = "team";
		interaction.options.getString = vi.fn().mockReturnValue(team.name);
	});

	it("should warn the user if the command is not used in a guild", async () => {
		expect.assertions(1);
		interaction.guildId = null;

		await expect(() =>
			createTeamSubcommand.execute(interaction, context),
		).rejects.toThrow(GuildOnlyError);
	});

	it("should create a team and reply with a success message", async () => {
		expect.assertions(2);

		await createTeamSubcommand.execute(interaction, context);

		expect(teamService.createTeam).toHaveBeenCalledWith(guild.id, team.name);
		expect(interaction.reply).toHaveBeenCalledWith({
			content: `Team "${team.name}" has been successfully created! You can now configure it using other \`/team\` subcommands.`,
			flags: [MessageFlags.Ephemeral],
		});
	});

	it("should handle cases where the team already exists", async () => {
		expect.assertions(1);
		const existingTeamError = new TeamAlreadyExistsError(team.name);
		vi.mocked(teamService.createTeam).mockRejectedValueOnce(existingTeamError);

		await expect(() =>
			createTeamSubcommand.execute(interaction, context),
		).rejects.toThrow(TeamAlreadyExistsError);
	});

	it("should re-throw unexpected errors", async () => {
		const unexpectedError = new Error("Something went wrong!");
		vi.mocked(teamService.createTeam).mockRejectedValueOnce(unexpectedError);

		await expect(
			createTeamSubcommand.execute(interaction, context),
		).rejects.toThrow(unexpectedError);
	});
});
