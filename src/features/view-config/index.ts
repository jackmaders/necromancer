import {
	type ChatInputCommandInteraction,
	SlashCommandSubcommandBuilder,
} from "discord.js";
import { teamService } from "@/entities/team";
import { guildService } from "@/entities/team/model/guild-service.ts";
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

		const guild = await guildService.ensureExists(interaction.guildId);
		const teams = await teamService.getTeamsByGuildId(guild.id);

		const config = {
			teams,
		};

		await replyWithGuildConfig(interaction, config);
	},
};
