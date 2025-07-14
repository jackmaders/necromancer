import { type ChatInputCommandInteraction, MessageFlags } from "discord.js";
import type { Team } from "prisma/generated/prisma-client-js/index";
import { beforeEach, describe, expect, it } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";
import { replyWithGuildConfig } from "../replies.ts";

describe("Config View Replies", () => {
	let interaction: MockProxy<ChatInputCommandInteraction>;
	let team: MockProxy<Team>;

	beforeEach(() => {
		team = mock<Team>();
		interaction = mock<ChatInputCommandInteraction>();
	});

	it("should create the embed with teams", async () => {
		team.name = "Test Team";
		await replyWithGuildConfig(interaction, { teams: [team, team] });

		expect(interaction.reply).toHaveBeenCalledWith({
			embeds: [
				{
					data: {
						color: 0x5865f2,
						fields: [
							{
								inline: true,
								name: "Teams",
								value: "Test Team, Test Team",
							},
						],
						footer: {
							text: `Server ID: ${interaction.guild?.id}`,
						},
						title: "⚙️ Configuration",
					},
				},
			],
			flags: [MessageFlags.Ephemeral],
		});
	});

	it("should create the embed with no teams", async () => {
		await replyWithGuildConfig(interaction, { teams: [] });

		expect(interaction.reply).toHaveBeenCalledWith({
			embeds: [
				{
					data: {
						color: 0x5865f2,
						fields: [
							{
								inline: true,
								name: "Teams",
								value: "None",
							},
						],
						footer: {
							text: `Server ID: ${interaction.guild?.id}`,
						},
						title: "⚙️ Configuration",
					},
				},
			],
			flags: [MessageFlags.Ephemeral],
		});
	});
});
