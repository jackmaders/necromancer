import {
	type ChatInputCommandInteraction,
	SlashCommandSubcommandBuilder,
} from "discord.js";
import { availabilityService } from "@/entities/availability/index.ts";
import { teamService } from "@/entities/team/index.ts";
import type { Subcommand } from "@/shared/lib";
import { GuildOnlyError } from "@/shared/model";
import { buildAvailabilityPoll } from "../ui/availability-poll.ts";

export class AvailabilityPostSubcommand implements Subcommand {
	readonly data = new SlashCommandSubcommandBuilder()
		.setName("post")
		.setDescription("Posts the weekly availability poll for a team.")
		.addStringOption((option) =>
			option
				.setName("team")
				.setDescription("The team to post the poll for.")
				.setRequired(true)
				.setAutocomplete(true),
		);

	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guildId) {
			throw new GuildOnlyError(interaction);
		}

		const teamName = interaction.options.getString("team", true);

		const team = await teamService.getTeamByName(interaction.guildId, teamName);

		const reply = await interaction.reply({
			poll: buildAvailabilityPoll(),
			withResponse: true,
		});

		await availabilityService.createPoll(
			team.id,
			reply.interaction.responseMessageId ?? reply.interaction.id,
			interaction.channelId,
		);
	}
}
