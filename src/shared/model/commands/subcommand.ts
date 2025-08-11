import type {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	SlashCommandSubcommandBuilder,
} from "discord.js";
import type { AppContext } from "../types/index.ts";

/**
 * The abstract class for any subcommand.
 */
export abstract class Subcommand {
	abstract readonly data: SlashCommandSubcommandBuilder;

	abstract execute(
		interaction: ChatInputCommandInteraction,
		context: AppContext,
	): Promise<void> | void;

	autocomplete?(
		interaction: AutocompleteInteraction,
		context: AppContext,
	): Promise<void> | void;
}
