import type { ChatInputCommandInteraction } from "discord.js";
import type { Team } from "prisma/generated/prisma-client-js";
import { beforeEach, describe, expect, it } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";
import { buildGuildConfigEmbed } from "../guild-config.ts";

describe("Guild Config Embed", () => {
	let interaction: MockProxy<ChatInputCommandInteraction>;
	let team: MockProxy<Team>;

	beforeEach(() => {
		team = mock<Team>();
		interaction = mock<ChatInputCommandInteraction>();
	});

	it("should create the embed with teams", () => {
		team.name = "Test Team";

		const embed = buildGuildConfigEmbed(interaction, { teams: [team, team] });

		expect(embed).toEqual({
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
		});
	});

	it("should create the embed with no teams", () => {
		const embed = buildGuildConfigEmbed(interaction, { teams: [] });

		expect(embed).toEqual({
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
		});
	});
});
