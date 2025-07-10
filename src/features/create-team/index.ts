import {
	type ChatInputCommandInteraction,
	SlashCommandStringOption,
	SlashCommandSubcommandBuilder,
} from "discord.js";
import { TeamAlreadyExistsError, teamService } from "@/entities/team/index.ts";
import type { Subcommand } from "@/shared/model";
import {
	replyWithErrorMessage,
	replyWithGuildOnlyCommandWarn,
	replyWithTeamCreated,
} from "./ui/replies.ts";

export const createTeamSubcommand: Subcommand = {
	data: new SlashCommandSubcommandBuilder()
		.setName("create")
		.setDescription("Creates a new team in this server.")
		.addStringOption(
			new SlashCommandStringOption()
				.setName("name")
				.setDescription("The name of the team.")
				.setRequired(true),
		),

	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guildId) {
			await replyWithGuildOnlyCommandWarn(interaction);
			return;
		}

		try {
			const teamName = interaction.options.getString("name", true);
			await teamService.createTeam(interaction.guildId, teamName);
			await replyWithTeamCreated(interaction, teamName);
		} catch (error) {
			if (error instanceof TeamAlreadyExistsError) {
				await replyWithErrorMessage(interaction, error);
				return;
			}

			throw error;
		}
	},
};
