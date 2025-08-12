import {
	type ChatInputCommandInteraction,
	SlashCommandBuilder,
} from "discord.js";
import type { StandaloneCommand } from "@/shared/lib";

export class PingCommand implements StandaloneCommand {
	readonly data = new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!");

	async execute(interaction: ChatInputCommandInteraction): Promise<void> {
		const response = await interaction.reply({
			content: "Pinging...",
			withResponse: true,
		});

		await interaction.editReply(
			`Pong! Roundtrip test latency: ${response.interaction.createdTimestamp - interaction.createdTimestamp}ms`,
		);
	}
}
