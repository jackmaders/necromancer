import { MessageFlags } from "discord.js";
import { describe, expect, it } from "vitest";
import { InteractionBuilder } from "@/testing/interaction-builder.ts";
import { replyWithTeamCreated } from "../replies.ts";

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
});
