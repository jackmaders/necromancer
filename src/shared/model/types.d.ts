import type {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

export interface AppContext {
	commands: Map<string, Command>;
}

export interface Subcommand {
	data: SlashCommandSubcommandBuilder;
	execute: (
		interaction: ChatInputCommandInteraction,
		context: AppContext,
	) => Promise<void> | void;
	// Add the autocomplete handler
	autocomplete?: (
		interaction: AutocompleteInteraction,
		context: AppContext,
	) => Promise<void> | void;
}

export interface Command {
	data:
		| SlashCommandBuilder
		| SlashCommandSubcommandsOnlyBuilder
		| Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
	execute: (
		interaction: ChatInputCommandInteraction,
		context: AppContext,
	) => Promise<void> | void;
	autocomplete?: (
		interaction: AutocompleteInteraction,
		context: AppContext,
	) => Promise<void> | void;
}
