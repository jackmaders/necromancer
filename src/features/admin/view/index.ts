import {
	type ChatInputCommandInteraction,
	MessageFlags,
	SlashCommandSubcommandBuilder,
} from "discord.js";
import { teamService } from "@/entities/team";
import type { Subcommand } from "@/shared/model";
import { GuildOnlyError } from "@/shared/model";
import { buildGuildConfigEmbed } from "./ui/guild-config.ts";

export const viewConfigSubcommand: Subcommand = {
	data: new SlashCommandSubcommandBuilder()
		.setName("server") // Discord.js uses "guild" but users would expect "server"
		.setDescription("Displays the configuration for the server."),

	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guildId) {
			throw new GuildOnlyError(interaction);
		}

		const teams = await teamService.getTeamsByGuildId(interaction.guildId);

		const config = {
			teams,
		};

		const embed = buildGuildConfigEmbed(interaction, config);

		await interaction.reply({
			embeds: [embed],
			flags: [MessageFlags.Ephemeral],
		});
	},
};
