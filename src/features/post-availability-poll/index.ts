import {
	type ChatInputCommandInteraction,
	SlashCommandStringOption,
	SlashCommandSubcommandBuilder,
} from "discord.js";

import { TeamDoesNotExistError } from "@/entities/team";
import type { Subcommand } from "@/shared/model";
import {
	replyWithErrorMessage,
	replyWithGuildOnlyCommandWarn,
} from "@/shared/ui";
import { availabilityService } from "./model/availability-service.ts";
import { replyWithAvailabilityPoll } from "./ui/replies.ts";

export const postAvailabilitySubcommand: Subcommand = {
	data: new SlashCommandSubcommandBuilder()
		.setName("post")
		.setDescription("Posts the weekly availability poll for a team.")
		.addStringOption(
			new SlashCommandStringOption()
				.setName("team")
				.setDescription("The name of the team to post for.")
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
