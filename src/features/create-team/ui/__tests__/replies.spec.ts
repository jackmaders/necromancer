import { type ChatInputCommandInteraction, MessageFlags } from "discord.js";
import type { Team } from "prisma/generated/prisma-client-js/index";
import { beforeEach, describe, expect, it } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";
import { replyWithTeamCreated } from "../replies.ts";

describe("Create Team Replies", () => {
	let interaction: MockProxy<ChatInputCommandInteraction>;
	let team: MockProxy<Team>;

	beforeEach(() => {
		team = mock<Team>();
		interaction = mock<ChatInputCommandInteraction>();
	});

	it("should send a team created confirmation", async () => {
		await replyWithTeamCreated(interaction, team.name);

		expect(interaction.reply).toHaveBeenCalledWith({
			content: `Team "${team.name}" has been successfully created! You can now configure it using other \`/team\` subcommands.`,
			flags: [MessageFlags.Ephemeral],
		});
	});
});
