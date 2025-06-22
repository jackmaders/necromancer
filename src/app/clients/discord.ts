import {
	Client,
	Events,
	GatewayIntentBits,
	type Interaction,
	REST,
	Routes,
} from "discord.js";
import { env } from "@/shared/config";
import type { Command } from "@/shared/lib/types";

export class DiscordClient {
	readonly client: Client;
	readonly commands = new Map<string, Command>();

	constructor() {
		this.client = new Client({
			intents: [GatewayIntentBits.Guilds],
		});

		this.registerEventHandlers();
		this.deployCommands();
	}

	/**
	 * Logs the client in with the provided token.
	 */
	login(token: string): Promise<string> {
		return this.client.login(token);
	}

	/**
	 * Registers all client event handlers.
	 */
	private registerEventHandlers(): void {
		this.client.once(Events.ClientReady, (readyClient) => {
			// biome-ignore lint/suspicious/noConsole: temporary logging
			console.log(`Ready! Logged in as ${readyClient.user.tag}`);
		});

		this.client.on(Events.InteractionCreate, (interaction) =>
			this.handleInteraction(interaction),
		);
	}

	private async deployCommands(): Promise<void> {
		try {
			await this.loadCommands();
			const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = env();
			const rest = new REST().setToken(DISCORD_TOKEN);

			const commandsData = Array.from(this.commands.values()).map((command) =>
				command.data.toJSON(),
			);

			await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), {
				body: commandsData,
			});
		} catch (error) {
			// biome-ignore lint/suspicious/noConsole: temporary logging
			console.error("Failed to deploy commands:", error);
		}
	}

	async loadCommands() {
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
				return;
			}

			await command.execute(interaction);
		} catch (error) {
			// biome-ignore lint/suspicious/noConsole: temporary logging
			console.error("Error handling interaction:", error);
		}
	}
}

// Set discordClint in globalThis to support Bun's hot reloading
// This allows us to reload commands without restarting the server
globalThis.discordClient?.loadCommands();
globalThis.discordClient ??= new DiscordClient();

export const discordClient = globalThis.discordClient;
