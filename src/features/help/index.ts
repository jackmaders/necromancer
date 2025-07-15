import {
	type ChatInputCommandInteraction,
	MessageFlags,
	SlashCommandBuilder,
} from "discord.js";
import { getCommands } from "@/app/config/commands";
import type { Command } from "@/shared/model";
import { buildHelpEmbed } from "./ui/message-payload.ts";

export const helpCommand: Command = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Displays a list of all available commands."),

	async execute(interaction: ChatInputCommandInteraction) {
		const commands = getCommands();

		const embed = buildHelpEmbed(commands);

		await interaction.reply({
			embeds: [embed],
			flags: [MessageFlags.Ephemeral], // Help is best sent privately
		});
	},
};
