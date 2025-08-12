import { type ChatInputCommandInteraction, MessageFlags } from "discord.js";
import type { Guild, Team } from "prisma/generated/prisma-client-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";
import { TeamAlreadyExistsError, teamService } from "@/entities/team/index.ts";

import { GuildOnlyError } from "@/shared/model";
import { TeamCreateSubcommand } from "..";

vi.mock("@/entities/team/index.ts");
vi.mock("@/shared/ui");

describe("Create Team Subcommand", () => {
	let command = new TeamCreateSubcommand();
	let interaction: MockProxy<ChatInputCommandInteraction>;

	let team: MockProxy<Team>;
	let guild: MockProxy<Guild>;

	beforeEach(() => {
		command = new TeamCreateSubcommand();
		team = mock<Team>();
		guild = mock<Guild>();
		interaction = mock<ChatInputCommandInteraction>();

		interaction.guildId = guild.id;
		interaction.commandName = "team";
		interaction.options.getString = vi.fn().mockReturnValue(team.name);
	});

	it("should warn the user if the command is not used in a guild", async () => {
		expect.assertions(1);
		interaction.guildId = null;

		await expect(() => command.execute(interaction)).rejects.toThrow(
			GuildOnlyError,
		);
	});

	it("should create a team and reply with a success message", async () => {
		expect.assertions(2);

		await command.execute(interaction);

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

		await expect(() => command.execute(interaction)).rejects.toThrow(
			TeamAlreadyExistsError,
		);
	});

	it("should re-throw unexpected errors", async () => {
		const unexpectedError = new Error("Something went wrong!");
		vi.mocked(teamService.createTeam).mockRejectedValueOnce(unexpectedError);

		await expect(command.execute(interaction)).rejects.toThrow(unexpectedError);
	});
});
