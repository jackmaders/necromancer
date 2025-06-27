import type { ChatInputCommandInteraction } from "discord.js";

export async function execute(interaction: ChatInputCommandInteraction) {
	const sent = await interaction.reply({
		content: "Pinging...",
		withResponse: true,
	});

	await interaction.editReply(
		`Pong! Roundtrip test latency: ${sent.interaction.createdTimestamp - interaction.createdTimestamp}ms`,
	);
}
