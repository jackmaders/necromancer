import {
	type ChatInputCommandInteraction,
	SlashCommandStringOption,
	SlashCommandSubcommandBuilder,
} from "discord.js";
import { teamService } from "@/entities/team/index.ts";
import type { Subcommand } from "@/shared/model";
import { GuildOnlyError } from "@/shared/model";
import { replyWithTeamCreated } from "./ui/replies.ts";

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
			throw new GuildOnlyError(interaction);
		}

		const teamName = interaction.options.getString("name", true);
		await teamService.createTeam(interaction.guildId, teamName);
		await replyWithTeamCreated(interaction, teamName);
	},
};
