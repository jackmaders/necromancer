import {
	type ChatInputCommandInteraction,
	SlashCommandSubcommandBuilder,
} from "discord.js";
import type { Subcommand } from "@/shared/lib";
import { GuildOnlyError } from "@/shared/model";
import { buildAvailabilityPoll } from "../ui/availability-poll.ts";

export class AvailabilityPostSubcommand implements Subcommand {
	readonly data = new SlashCommandSubcommandBuilder()
		.setName("post")
		.setDescription("Posts the weekly availability poll for a team.");

	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guildId) {
			throw new GuildOnlyError(interaction);
		}

		const poll = buildAvailabilityPoll();

		await interaction.reply({ poll });
	}
}
