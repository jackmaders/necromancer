import type {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

export interface Subcommand {
	data: SlashCommandSubcommandBuilder;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void;
	// Add the autocomplete handler
	autocomplete?: (interaction: AutocompleteInteraction) => Promise<void> | void;
}

export interface Command {
	data:
		| SlashCommandBuilder
		| SlashCommandSubcommandsOnlyBuilder
		| Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void;
	autocomplete?: (interaction: AutocompleteInteraction) => Promise<void> | void;
}
