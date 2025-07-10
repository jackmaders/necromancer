import { describe, expect, it, vi } from "vitest";
import { InteractionBuilder } from "@/testing/interaction-builder.ts";
import { createTeamSubcommand } from "..";
import { TeamAlreadyExistsError } from "../model/errors/team-already-exists-error.ts";
import { teamService } from "../model/team-service.ts";
import * as replies from "../ui/replies.ts";

vi.mock("../model/team-service.ts");
vi.mock("../ui/replies.ts");

describe("Create Team Subcommand", () => {
	const teamName = "Test Team";
	const guildId = "test-guild-id";

	it("should warn the user if the command is not used in a guild", async () => {
		const interaction = new InteractionBuilder("team").build();
		interaction.guildId = null;

		await createTeamSubcommand.execute(interaction);
		expect(replies.replyWithGuildOnlyCommandWarn).toHaveBeenCalledWith(
			interaction,
		);
	});

	it("should create a team and reply with a success message", async () => {
		const interaction = new InteractionBuilder("team")
			.with({
				guildId,
				options: {
					getString: vi.fn().mockReturnValue(teamName),
				},
				valueOf: vi.fn(),
			})
			.build();

		await createTeamSubcommand.execute(interaction);

		expect(teamService.createTeam).toHaveBeenCalledWith(guildId, teamName);
		expect(replies.replyWithTeamCreated).toHaveBeenCalledWith(
			interaction,
			teamName,
		);
	});

	it("should handle cases where the team already exists", async () => {
		const interaction = new InteractionBuilder("team")
			.with({
				guildId,
				options: {
					getString: vi.fn().mockReturnValue(teamName),
				},
				valueOf: vi.fn(),
			})
			.build();
		const existingTeamError = new TeamAlreadyExistsError(teamName);
		vi.mocked(teamService.createTeam).mockRejectedValueOnce(existingTeamError);

		await createTeamSubcommand.execute(interaction);

		expect(replies.replyWithErrorMessage).toHaveBeenCalledWith(
			interaction,
			existingTeamError,
		);
	});

	it("should re-throw unexpected errors", async () => {
		const interaction = new InteractionBuilder("team")
			.with({
				guildId,
				options: {
					getString: vi.fn().mockReturnValue(teamName),
				},
				valueOf: vi.fn(),
			})
			.build();
		const unexpectedError = new Error("Something went wrong!");
		vi.mocked(teamService.createTeam).mockRejectedValueOnce(unexpectedError);

		await expect(createTeamSubcommand.execute(interaction)).rejects.toThrow(
			unexpectedError,
		);
	});
});
