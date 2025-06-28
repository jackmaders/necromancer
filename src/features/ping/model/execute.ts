import type { ChatInputCommandInteraction } from "discord.js";

export async function execute(interaction: ChatInputCommandInteraction) {
	// Using withResponse returns a InteractionCallbackResponse, we need to extract the interaction from it
	// https://discord.js.org/docs/packages/discord.js/main/InteractionCallbackResponse:Class
	const response = await interaction.reply({
		content: "Pinging...",
		withResponse: true,
	});

	await interaction.editReply(
		`Pong! Roundtrip test latency: ${response.interaction.createdTimestamp - interaction.createdTimestamp}ms`,
	);
}
