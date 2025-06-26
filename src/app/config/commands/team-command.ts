import {
	type ChatInputCommandInteraction,
	SlashCommandBuilder,
} from "discord.js";
import { command as createTeamSubcommand } from "@/features/create-team";
import { logger } from "@/shared/model";

export const teamCommand = {
	data: new SlashCommandBuilder()
		.setName("team")
		.addSubcommand(createTeamSubcommand.data),
	async execute(interaction: ChatInputCommandInteraction) {
		const subcommandName = interaction.options.getSubcommand();

		switch (subcommandName) {
			case createTeamSubcommand.data.name: {
				await createTeamSubcommand.execute(interaction);
				break;
			}
			default: {
				logger.warn("The provided command could not be found", subcommandName);
				break;
			}
		}
	},
};
