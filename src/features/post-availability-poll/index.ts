import {
	type AutocompleteInteraction,
	type ChatInputCommandInteraction,
	SlashCommandStringOption,
	SlashCommandSubcommandBuilder,
} from "discord.js";

import { teamService } from "@/entities/team";
import type { Subcommand } from "@/shared/model";
import { GuildOnlyError } from "@/shared/model";
import { availabilityService } from "./model/availability-service.ts";
import { editReplyWithAvailabilityPollEmbed } from "./ui/replies.ts";

export const postAvailabilitySubcommand: Subcommand = {
	async autocomplete(interaction: AutocompleteInteraction) {
		if (!interaction.guildId) {
			throw new GuildOnlyError(interaction);
		}

		const focusedValue = interaction.options.getFocused();

		const teams = await teamService.getTeamsByGuildId(interaction.guildId);
		const teamNames = teams.map((team) => team.name.toLocaleLowerCase());

		const matchingNames = teamNames.filter((name) =>
			name.startsWith(focusedValue.toLowerCase()),
		);

		const options = matchingNames
			.map((name) => ({
				name: name,
				value: name,
			}))
			.slice(0, 25);

		await interaction.respond(options);
	},
	data: new SlashCommandSubcommandBuilder()
		.setName("post")
		.setDescription("Posts the weekly availability poll for a team.")
		.addStringOption(
			new SlashCommandStringOption()
				.setName("team")
				.setDescription("The name of the team to post for.")
				.setAutocomplete(true)
				.setRequired(true),
		),

	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guildId) {
			throw new GuildOnlyError(interaction);
		}

		await interaction.deferReply();

		const teamName = interaction.options.getString("team", true);

		const poll = await availabilityService.createPoll(
			interaction.guildId,
			teamName,
		);

		await editReplyWithAvailabilityPollEmbed(interaction, poll);

		const messageId = (await interaction.fetchReply()).id;

		await availabilityService.setPollMessageId(poll.id, messageId);
	},
};
