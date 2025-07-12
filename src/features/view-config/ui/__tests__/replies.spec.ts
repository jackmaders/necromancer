import { MessageFlags } from "discord.js";
import type { Team } from "prisma/generated/prisma-client-js";
import { describe, expect, it } from "vitest";
import { InteractionBuilder } from "@/testing/interaction-builder.ts";
import { replyWithGuildConfig } from "../replies.ts";

const guild = {
	createdAt: new Date(),
	guildId: "test-guild-db-id",
	id: "test-db-guild-id",
	updatedAt: new Date(),
};
const team: Team = {
	createdAt: new Date(),
	guildId: guild.id,
	id: "test-team-id",
	name: "Test Team",
	updatedAt: new Date(),
};
describe("Config View Replies", () => {
	it("should create the embed with teams", async () => {
		const interaction = new InteractionBuilder("team").build();

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
		const interaction = new InteractionBuilder("team").build();

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
