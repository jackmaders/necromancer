import { describe, expect, it, vi } from "vitest";
import { TeamDoesNotExistError, teamService } from "@/entities/team/index.ts";
import { GuildOnlyError } from "@/shared/model";
import { InteractionBuilder } from "@/testing/interaction-builder.ts";
import { deleteTeamSubcommand } from "..";
import { replyWithTeamDeleted } from "../ui/replies.ts";

vi.mock("@/entities/team/index.ts");
vi.mock("../ui/replies.ts");
vi.mock("@/shared/ui");

describe("Delete Team Subcommand", () => {
	const teamName = "Test Team";
	const guildId = "test-guild-id";

	it("should warn the user if the command is not used in a guild", async () => {
		expect.assertions(1);
		const interaction = new InteractionBuilder("team").build();
		interaction.guildId = null;

		await expect(() =>
			deleteTeamSubcommand.execute(interaction),
		).rejects.toThrow(GuildOnlyError);
	});

	it("should delete a team and reply with a success message", async () => {
		const interaction = new InteractionBuilder("team")
			.with({
				guildId,
				options: {
					getString: vi.fn().mockReturnValue(teamName),
				},
				valueOf: vi.fn(),
			})
			.build();

		await deleteTeamSubcommand.execute(interaction);

		expect(teamService.deleteTeam).toHaveBeenCalledWith(guildId, teamName);
		expect(replyWithTeamDeleted).toHaveBeenCalledWith(interaction, teamName);
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
		const teamNotExistError = new TeamDoesNotExistError(teamName);
		vi.mocked(teamService.deleteTeam).mockRejectedValueOnce(teamNotExistError);

		await expect(() =>
			deleteTeamSubcommand.execute(interaction),
		).rejects.toThrow(TeamDoesNotExistError);
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
		vi.mocked(teamService.deleteTeam).mockRejectedValueOnce(unexpectedError);

		await expect(deleteTeamSubcommand.execute(interaction)).rejects.toThrow(
			unexpectedError,
		);
	});
});
