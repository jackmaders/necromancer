import type {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

export interface Subcommand {
	data: SlashCommandSubcommandBuilder;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void;
}

export interface Command {
	data:
		| SlashCommandBuilder
		| SlashCommandSubcommandsOnlyBuilder
		| Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void;
}
