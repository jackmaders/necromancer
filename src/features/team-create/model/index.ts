import {
	type ChatInputCommandInteraction,
	SlashCommandStringOption,
	SlashCommandSubcommandBuilder,
} from "discord.js";
import { teamService } from "@/entities/team/index.ts";
import type { Subcommand } from "@/shared/model";
import { GuildOnlyError } from "@/shared/model";
import { buildReplyOptions } from "../ui/message-payload.ts";

export class TeamCreateSubcommand implements Subcommand {
	readonly data = new SlashCommandSubcommandBuilder()
		.setName("create")
		.setDescription("Creates a new team in this server.")
		.addStringOption(
			new SlashCommandStringOption()
				.setName("name")
				.setDescription("The name of the team.")
				.setRequired(true)
				.setMinLength(3)
				.setMaxLength(128),
		);

	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guildId) {
			throw new GuildOnlyError(interaction);
		}

		const teamName = interaction.options.getString("name", true);
		await teamService.createTeam(interaction.guildId, teamName);
		const options = buildReplyOptions(teamName);

		await interaction.reply(options);
	}
}
