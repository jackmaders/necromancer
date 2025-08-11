import {
	type AutocompleteInteraction,
	type ChatInputCommandInteraction,
	SlashCommandStringOption,
	SlashCommandSubcommandBuilder,
} from "discord.js";
import { teamService } from "@/entities/team/index.ts";
import type { Subcommand } from "@/shared/model";
import { GuildOnlyError } from "@/shared/model";
import { buildReplyOptions } from "../ui/message-payload.ts";

export class TeamDeleteSubcommand implements Subcommand {
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
	}
	readonly data = new SlashCommandSubcommandBuilder()
		.setName("delete")
		.setDescription("Deletes an existing team from this server.")
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
		await teamService.deleteTeam(interaction.guildId, teamName);
		const options = buildReplyOptions(teamName);

		await interaction.reply(options);
	}
}
