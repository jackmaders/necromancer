import { MessageFlags } from "discord.js";
import { describe, expect, it } from "vitest";
import { InteractionBuilder } from "@/testing/interaction-builder.ts";
import { replyWithTeamDeleted } from "../replies.ts";

describe("Create Team Replies", () => {
	it("should send a team deleted confirmation", async () => {
		const interaction = new InteractionBuilder("team").build();
		const teamName = "Victorious Secret";
		await replyWithTeamDeleted(interaction, teamName);

		expect(interaction.reply).toHaveBeenCalledWith({
			content: `Team \"Victorious Secret\" has been successfully deleted!`,
			flags: [MessageFlags.Ephemeral],
		});
	});
});
