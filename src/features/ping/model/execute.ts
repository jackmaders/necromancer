import type { ChatInputCommandInteraction } from "discord.js";

export async function execute(interaction: ChatInputCommandInteraction) {
	const sent = await interaction.reply({
		content: "Pinging...",
		fetchReply: true,
	});

	await interaction.editReply(
		`Pong! Roundtrip test latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`,
	);
}
