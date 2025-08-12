import {
	type AutocompleteInteraction,
	type ChatInputCommandInteraction,
	SlashCommandBuilder,
	type SlashCommandSubcommandBuilder,
	type SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import type { AppContext } from "../../model/types/index.ts";
import { logger } from "../logging/logger-client.ts";

/**
 * The abstract base class that all top-level command classes must extend.
 * It defines the core properties and methods that the command loader and
 * Discord client will interact with.
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

/**
 * The abstract base class for a command that does NOT have any subcommands.
 */
export abstract class StandaloneCommand extends Command {
	abstract override readonly data: Omit<
		SlashCommandBuilder,
		"addSubcommand" | "addSubcommandGroup"
	>;
}

/**
 * The abstract base class that all subcommand classes must extend.
 * It ensures they have the necessary properties to be registered by a ParentCommand.
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

/**
 * A concrete class for creating parent commands that act as routers for a group of subcommands.
 * It handles the logic of building the command and dispatching interactions to the correct subcommand.
 */
export class ParentCommand extends Command {
	readonly data: SlashCommandSubcommandsOnlyBuilder;
	readonly subcommands: Map<string, Subcommand>;

	constructor(name: string, description: string, subcommands: Subcommand[]) {
		super();
		this.data = new SlashCommandBuilder()
			.setName(name)
			.setDescription(description);
		this.subcommands = new Map();

		for (const subcommand of subcommands) {
			this.data.addSubcommand(subcommand.data);
			this.subcommands.set(subcommand.data.name, subcommand);
		}
	}

	/**
	 * Routes the interaction to the appropriate subcommand's execute method.
	 */
	async execute(
		interaction: ChatInputCommandInteraction,
		context: AppContext,
	): Promise<void> {
		const subcommandName = interaction.options.getSubcommand(true);
		const subcommand = this.subcommands.get(subcommandName);

		if (!subcommand) {
			logger.error(
				`Subcommand "${subcommandName}" not found for parent "${this.data.name}".`,
			);
			await interaction.reply({
				content: "I couldn't find that subcommand. This may be a bug.",
				ephemeral: true,
			});
			return;
		}

		await subcommand.execute(interaction, context);
	}

	/**
	 * Routes the autocomplete interaction to the appropriate subcommand's autocomplete method.
	 */
	async autocomplete(
		interaction: AutocompleteInteraction,
		context: AppContext,
	): Promise<void> {
		const subcommandName = interaction.options.getSubcommand(true);
		const subcommand = this.subcommands.get(subcommandName);

		if (subcommand?.autocomplete) {
			await subcommand.autocomplete(interaction, context);
		}
	}
}
