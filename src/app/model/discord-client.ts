import {
	Client,
	Events,
	GatewayIntentBits,
	type Interaction,
	type InteractionReplyOptions,
	MessageFlags,
} from "discord.js";
import type { Command } from "@/shared/model";
import { AppError, logger } from "@/shared/model";
import { getCommands } from "../config/commands.ts";

export class DiscordClient {
	readonly commands = new Map<string, Command>();
	readonly client = new Client({
		intents: [GatewayIntentBits.Guilds],
	});

	constructor() {
		this.registerEventHandlers();
	}

	/**
	 * Initializes the Discord client and logs the client in.
	 */
	async init(token: string) {
		await this.loadCommands();
		await this.client.login(token);
	}

	/**
	 * Registers all client event handlers.
	 */
	private registerEventHandlers(): void {
		this.client.once(Events.ClientReady, (readyClient) => {
			logger.info(`Ready! Logged in as ${readyClient.user.tag}`);
		});

		this.client.on(Events.InteractionCreate, (interaction) =>
			this.handleInteraction(interaction),
		);
	}

	private loadCommands() {
		const commands = getCommands();

		this.commands.clear();
		for (const command of commands) {
			this.commands.set(command.data.name, command);
		}
	}

	private async handleInteraction(interaction: Interaction) {
		try {
			if (interaction.isChatInputCommand()) {
				const command = this.commands.get(interaction.commandName);
				if (command) {
					await command.execute(interaction);
				}
			} else if (interaction.isAutocomplete()) {
				const command = this.commands.get(interaction.commandName);
				if (command?.autocomplete) {
					await command.autocomplete(interaction);
				}
			}
		} catch (error) {
			logger.error(
				`Error handling interaction (ID: ${interaction.id}): ${error}`,
			);
			await this.handleInteractionError(
				interaction,
				error instanceof Error ? error : new Error(String(error)),
			);
		}
	}

	private async handleInteractionError(interaction: Interaction, error: Error) {
		try {
			if (!interaction.isRepliable()) {
				throw new Error("Interaction is not repliable");
			}

			let content = "There was an error while executing this command!";

			if (error instanceof AppError) {
				content = error.display;
			}

			const replyOptions: InteractionReplyOptions = {
				content,
				flags: [MessageFlags.Ephemeral],
			};

			if (interaction.replied || interaction.deferred) {
				await interaction.followUp(replyOptions);
			} else {
				await interaction.reply(replyOptions);
			}
		} catch (replyError) {
			logger.error(
				`Failed to send error reply for interaction ${interaction.id}: ${replyError}`,
			);
		}
	}
}

export const discord = new DiscordClient();
