import { type ChatInputCommandInteraction, MessageFlags } from "discord.js";
import type { Team } from "prisma/generated/prisma-client-js/index";
import { beforeEach, describe, expect, it } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";
import { replyWithTeamDeleted } from "../replies.ts";

describe("Delete Team Replies", () => {
	let interaction: MockProxy<ChatInputCommandInteraction>;
	let team: MockProxy<Team>;

	beforeEach(() => {
		team = mock<Team>();
		interaction = mock<ChatInputCommandInteraction>();
	});

	it("should send a team deleted confirmation", async () => {
		await replyWithTeamDeleted(interaction, team.name);

		expect(interaction.reply).toHaveBeenCalledWith({
			content: `Team "${team.name}" has been successfully deleted!`,
			flags: [MessageFlags.Ephemeral],
		});
	});
});
