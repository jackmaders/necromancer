import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ChatInputCommandInteraction,
	EmbedBuilder,
	Locale,
} from "discord.js";
import type { Poll } from "prisma/generated/prisma-client-js/index";
import { beforeEach, describe, expect, it } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";

import { editReplyWithAvailabilityPollEmbed } from "../replies.ts";

describe("Availability Poll Embed Replies", () => {
	let interaction: MockProxy<ChatInputCommandInteraction>;
	let poll: MockProxy<Poll>;

	beforeEach(() => {
		interaction = mock<ChatInputCommandInteraction>();
		poll = mock<Poll>();
		interaction.locale = Locale.EnglishGB;
	});

	it("should edit the reply with the availability poll embed", async () => {
		poll.weekStartDate = new Date("2025-07-14T00:00:00.000Z");
		poll.id = "poll-id";

		await editReplyWithAvailabilityPollEmbed(interaction, poll);

		const expectedEmbed = new EmbedBuilder()
			.setColor(0x5865f2)
			.setTitle("🗓️ Availability for 14 July 2025 - 20 July 2025")
			.setDescription(
				"Click the button below to set your availability for the week.",
			)
			.addFields({
				inline: true,
				name: "✅ Responses",
				value: "No one has responded yet!",
			});

		const expectedButton = new ButtonBuilder()
			.setCustomId("availability-set:poll-id")
			.setLabel("Set Availability")
			.setStyle(ButtonStyle.Primary);

		const expectedRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			expectedButton,
		);

		expect(interaction.editReply).toHaveBeenCalledWith({
			components: [expectedRow],
			embeds: [expectedEmbed],
		});
	});
});
