import { MessageFlags } from "discord.js";
import { describe, expect, it } from "vitest";
import { InteractionBuilder } from "@/testing/interaction-builder.ts";
import {
	replyWithErrorMessage,
	replyWithGuildOnlyCommandWarn,
} from "../replies.ts";

describe("Default Replies", () => {
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
		const error = new Error("Team Hydra");
		await replyWithErrorMessage(interaction, error);

		expect(interaction.reply).toHaveBeenCalledWith({
			content: error.message,
			flags: [MessageFlags.Ephemeral],
		});
	});
});
