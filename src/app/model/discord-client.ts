import {
	Client,
	Events,
	GatewayIntentBits,
	type Interaction,
	type InteractionReplyOptions,
	MessageFlags,
} from "discord.js";
import type { Command } from "@/shared/model";
import { logger } from "@/shared/model";

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

	private async loadCommands() {
		// Need dynamic import to support Bun's hot reloading
		const { commands } = await import("../config/commands.ts");

		this.commands.clear();
		for (const command of commands) {
			this.commands.set(command.data.name, command);
		}
	}

	private async handleInteraction(interaction: Interaction) {
		try {
			if (!interaction.isChatInputCommand()) {
				return;
			}

			const command = this.commands.get(interaction.commandName);

			if (!command) {
				logger.warn(
					`No command matching "${interaction.commandName}" was found.`,
				);
				return;
			}

			await command.execute(interaction);
		} catch (error) {
			logger.error(
				`Error handling interaction (ID: ${interaction.id}): ${error}`,
			);
			await this.sendErrorReply(interaction);
		}
	}

	private async sendErrorReply(interaction: Interaction) {
		try {
			if (!interaction.isRepliable()) {
				throw new Error("Interaction is not repliable");
			}

			const replyOptions: InteractionReplyOptions = {
				content: "There was an error while executing this command!",
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
