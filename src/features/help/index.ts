import {
	type ChatInputCommandInteraction,
	MessageFlags,
	SlashCommandBuilder,
} from "discord.js";
import type { AppContext, Command } from "@/shared/model";
import { buildHelpEmbed } from "./ui/message-payload.ts";

export const helpCommand: Command = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Displays a list of all available commands."),

	async execute(
		interaction: ChatInputCommandInteraction,
		{ commands }: AppContext,
	) {
		const commandsArray = Array.from(commands).map(([_, command]) => command);

		const embed = buildHelpEmbed(commandsArray);

		await interaction.reply({
			embeds: [embed],
			flags: [MessageFlags.Ephemeral], // Help is best sent privately
		});
	},
};
