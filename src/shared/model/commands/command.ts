// src/shared/model/command.ts
import type {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import type { AppContext } from "../types/index.ts";

/**
 * The abstract class for any top-level slash command.
 */
export abstract class Command {
	abstract readonly data:
		| Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
		| SlashCommandSubcommandsOnlyBuilder;

	abstract execute(
		interaction: ChatInputCommandInteraction,
		context: AppContext,
	): Promise<void> | void;

	autocomplete?(
		interaction: AutocompleteInteraction,
		context: AppContext,
	): Promise<void> | void;
}
