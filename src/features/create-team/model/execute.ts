import type { ChatInputCommandInteraction } from "discord.js";

export async function execute(interaction: ChatInputCommandInteraction) {
	await interaction.reply({
		content: "Creating Team...",
	});
}
