import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	type ChatInputCommandInteraction,
	EmbedBuilder,
} from "discord.js";
import type { Poll } from "prisma/generated/prisma-client-js";

/**
 * Formats a date range for the poll title.
 */
function getWeekDateRange(startDate: Date): string {
	const end = new Date(startDate);
	end.setDate(startDate.getDate() + 6); // Add 6 days to get to Sunday

	const options: Intl.DateTimeFormatOptions = {
		day: "numeric",
		month: "long",
		year: "numeric",
	};

	const startFormatted = startDate.toLocaleDateString("en-US", options);
	const endFormatted = end.toLocaleDateString("en-US", options);

	return `${startFormatted} - ${endFormatted}`;
}

/**
 * Builds and sends the availability poll embed with a button.
 */
export async function replyWithAvailabilityPoll(
	interaction: ChatInputCommandInteraction,
	poll: Poll,
) {
	const embed = new EmbedBuilder()
		.setColor(0x5865f2)
		.setTitle(`🗓️ Availability for ${getWeekDateRange(poll.weekStartDate)}`)
		.setDescription(
			"Click the button below to set your availability for the week.",
		)
		.addFields({
			inline: true,
			name: "✅ Responses",
			value: "No one has responded yet!",
		});

	const setAvailabilityButton = new ButtonBuilder()
		.setCustomId(`availability-set:${poll.id}`) // Namespaced ID with poll context
		.setLabel("Set Availability")
		.setStyle(ButtonStyle.Primary);

	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
		setAvailabilityButton,
	);

	// Using withResponse ensures the full message object is returned
	return await interaction.reply({
		components: [row],
		embeds: [embed],
		withResponse: true,
	});
}
