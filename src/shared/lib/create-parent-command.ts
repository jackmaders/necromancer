import {
	type AutocompleteInteraction,
	type ChatInputCommandInteraction,
	MessageFlags,
	SlashCommandBuilder,
} from "discord.js";
import type { Command, Subcommand } from "@/shared/model";
import { logger } from "@/shared/model";

/**
 * Creates a parent slash command that acts as a router for its subcommands.
 * @param name - The name of the parent command.
 * @param description - The description of the parent command.
 * @param subcommands - An array of subcommand objects to register under this parent.
 * @returns A fully constructed Command object with a generic execute method.
 */
export function createParentCommand(
	name: string,
	description: string,
	subcommands: Subcommand[],
): Command {
	const data = new SlashCommandBuilder()
		.setName(name)
		.setDescription(description);

	const subcommandsMap = new Map<string, Subcommand>();
	for (const subcommand of subcommands) {
		data.addSubcommand(subcommand.data);
		subcommandsMap.set(subcommand.data.name, subcommand);
	}

	async function execute(interaction: ChatInputCommandInteraction) {
		const subcommandName = interaction.options.getSubcommand();
		const subcommand = subcommandsMap.get(subcommandName);

		if (subcommand) {
			await subcommand.execute(interaction);
		} else {
			logger.warn(
				`No matching subcommand found for command "${name}"`,
				subcommandName,
			);
			await interaction.reply({
				content: "I couldn't find that subcommand. Please report this issue.",
				flags: [MessageFlags.Ephemeral],
			});
		}
	}

	async function autocomplete(interaction: AutocompleteInteraction) {
		const subcommandName = interaction.options.getSubcommand();

		const subcommand = subcommandsMap.get(subcommandName);
		if (subcommand?.autocomplete) {
			await subcommand.autocomplete(interaction);
		}
	}

	return {
		autocomplete,
		data,
		execute,
	};
}
