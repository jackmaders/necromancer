import {
	type ChatInputCommandInteraction,
	SlashCommandSubcommandBuilder,
} from "discord.js";
import { teamService } from "@/entities/team";
import type { Subcommand } from "@/shared/model";
import { replyWithGuildOnlyCommandWarn } from "@/shared/ui";
import { replyWithGuildConfig } from "./ui/replies.ts";

export const viewConfigSubcommand: Subcommand = {
	data: new SlashCommandSubcommandBuilder()
		.setName("server") // Discord.js uses "guild" but users would expect "server"
		.setDescription("Displays the configuration for the server."),

	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guildId) {
			await replyWithGuildOnlyCommandWarn(interaction);
			return;
		}

		const teams = await teamService.getTeamsByGuildId(interaction.guildId);

		const config = {
			teams,
		};

		await replyWithGuildConfig(interaction, config);
	},
};
