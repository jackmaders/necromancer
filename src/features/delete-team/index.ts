import {
	type ChatInputCommandInteraction,
	SlashCommandStringOption,
	SlashCommandSubcommandBuilder,
} from "discord.js";
import { TeamDoesNotExistsError } from "@/entities/team";
import { teamService } from "@/entities/team/index.ts";
import type { Subcommand } from "@/shared/model";
import {
	replyWithErrorMessage,
	replyWithGuildOnlyCommandWarn,
} from "@/shared/ui/index.ts";
import { replyWithTeamDeleted } from "./ui/replies.ts";

export const deleteTeamSubcommand: Subcommand = {
	data: new SlashCommandSubcommandBuilder()
		.setName("delete")
		.setDescription("Deletes an existing team from this server.")
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
			await teamService.deleteTeam(interaction.guildId, teamName);
			await replyWithTeamDeleted(interaction, teamName);
		} catch (error) {
			if (error instanceof TeamDoesNotExistsError) {
				await replyWithErrorMessage(interaction, error);
				return;
			}

			throw error;
		}
	},
};
