import type { ChatInputCommandInteraction } from "discord.js";
import type { Guild, Team } from "prisma/generated/prisma-client-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";
import { TeamAlreadyExistsError, teamService } from "@/entities/team/index.ts";
import { GuildOnlyError } from "@/shared/model";
import { createTeamSubcommand } from "..";
import { replyWithTeamCreated } from "../ui/replies.ts";

vi.mock("@/entities/team/index.ts");
vi.mock("../ui/replies.ts");
vi.mock("@/shared/ui");

describe("Create Team Subcommand", () => {
	let interaction: MockProxy<ChatInputCommandInteraction>;
	let team: MockProxy<Team>;
	let guild: MockProxy<Guild>;

	beforeEach(() => {
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

		await expect(() =>
			createTeamSubcommand.execute(interaction),
		).rejects.toThrow(GuildOnlyError);
	});

	it("should create a team and reply with a success message", async () => {
		expect.assertions(2);

		await createTeamSubcommand.execute(interaction);

		expect(teamService.createTeam).toHaveBeenCalledWith(guild.id, team.name);
		expect(replyWithTeamCreated).toHaveBeenCalledWith(interaction, team.name);
	});

	it("should handle cases where the team already exists", async () => {
		expect.assertions(1);
		const existingTeamError = new TeamAlreadyExistsError(team.name);
		vi.mocked(teamService.createTeam).mockRejectedValueOnce(existingTeamError);

		await expect(() =>
			createTeamSubcommand.execute(interaction),
		).rejects.toThrow(TeamAlreadyExistsError);
	});

	it("should re-throw unexpected errors", async () => {
		const unexpectedError = new Error("Something went wrong!");
		vi.mocked(teamService.createTeam).mockRejectedValueOnce(unexpectedError);

		await expect(createTeamSubcommand.execute(interaction)).rejects.toThrow(
			unexpectedError,
		);
	});
});
