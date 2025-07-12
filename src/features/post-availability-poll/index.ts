import {
	type AutocompleteInteraction,
	type ChatInputCommandInteraction,
	SlashCommandStringOption,
	SlashCommandSubcommandBuilder,
} from "discord.js";

import { TeamDoesNotExistError, teamService } from "@/entities/team";
import type { Subcommand } from "@/shared/model";
import {
	replyWithErrorMessage,
	replyWithGuildOnlyCommandWarn,
} from "@/shared/ui";
import { availabilityService } from "./model/availability-service.ts";
import { replyWithAvailabilityPoll } from "./ui/replies.ts";

export const postAvailabilitySubcommand: Subcommand = {
	async autocomplete(interaction: AutocompleteInteraction) {
		if (!interaction.guildId) {
			return;
		}

		const focusedValue = interaction.options.getFocused();

		const teams = await teamService.getTeamsByGuildId(interaction.guildId);

		const filtered = teams.filter((team) =>
			team.name.toLowerCase().startsWith(focusedValue.toLowerCase()),
		);

		const mapped = filtered
			.map((team) => ({
				name: team.name,
				value: team.name,
			}))
			.slice(0, 25);

		await interaction.respond(mapped);
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
		if (!(interaction.guildId && interaction.channel)) {
			await replyWithGuildOnlyCommandWarn(interaction);
			return;
		}

		try {
			const teamName = interaction.options.getString("team", true);

			// 1. Create the poll in the database via the (to be created) availability service
			const poll = await availabilityService.createPoll(
				interaction.guildId,
				teamName,
			);

			// 2. Send the poll message to the channel, returning the response
			const response = await replyWithAvailabilityPoll(interaction, poll);

			const messageId = response.interaction.responseMessageId;

			if (!messageId) {
				throw new Error("Failed to retrieve message ID from response.");
			}

			// 3. Update the poll record with the new message ID for future reference
			await availabilityService.setPollMessageId(poll.id, messageId);
		} catch (error) {
			if (error instanceof TeamDoesNotExistError) {
				await replyWithErrorMessage(interaction, error);
				return;
			}
			// Let the global handler catch other errors
			throw error;
		}
	},
};
