import { SlashCommandBuilder } from "discord.js";
import type { Command } from "@/shared/model";

export const pingCommand: Command = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!"),
	async execute(interaction) {
		const sent = await interaction.reply({
			content: "Pinging...",
			fetchReply: true,
		});

		await interaction.editReply(
			`Pong! Roundtrip test latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`,
		);
	},
};
