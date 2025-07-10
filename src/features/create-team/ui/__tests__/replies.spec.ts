import { MessageFlags } from "discord.js";
import { describe, expect, it } from "vitest";
import { InteractionBuilder } from "@/testing/interaction-builder.ts";
import { TeamAlreadyExistsError } from "../../model/errors/team-already-exists-error.ts";
import {
	replyWithErrorMessage,
	replyWithGuildOnlyCommandWarn,
	replyWithTeamCreated,
} from "../replies.ts";

describe("Create Team Replies", () => {
	it("should send a team created confirmation", async () => {
		const interaction = new InteractionBuilder("team").build();
		const teamName = "Victorious Secret";
		await replyWithTeamCreated(interaction, teamName);

		expect(interaction.reply).toHaveBeenCalledWith({
			content: `Team "${teamName}" has been successfully created! You can now configure it using other \`/team\` subcommands.`,
			flags: [MessageFlags.Ephemeral],
		});
	});

	it("should send a guild-only command warning", async () => {
		const interaction = new InteractionBuilder("team").build();
		await replyWithGuildOnlyCommandWarn(interaction);

		expect(interaction.reply).toHaveBeenCalledWith({
			content: "This command can only be used in a server.",
			flags: [MessageFlags.Ephemeral],
		});
	});

	it("should send a generic error message", async () => {
		const interaction = new InteractionBuilder("team").build();
		const error = new TeamAlreadyExistsError("Team Hydra");
		await replyWithErrorMessage(interaction, error);

		expect(interaction.reply).toHaveBeenCalledWith({
			content: error.message,
			flags: [MessageFlags.Ephemeral],
		});
	});
});
