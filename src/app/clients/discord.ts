import { Client, Events, GatewayIntentBits } from "discord.js";

export class DiscordClient {
	readonly client: Client;

	constructor() {
		this.client = new Client({
			intents: [GatewayIntentBits.Guilds],
		});
		this.registerHandlers();
	}

	/**
	 * Registers all client event handlers.
	 */
	private registerHandlers(): void {
		this.client.once(Events.ClientReady, (readyClient) => {
			// biome-ignore lint/suspicious/noConsole: temporary logging
			console.log(`Ready! Logged in as ${readyClient.user.tag}`);
		});
	}

	/**
	 * Logs the client in with the provided token.
	 */
	login(token: string): Promise<string> {
		return this.client.login(token);
	}
}

export const discordClient = new DiscordClient();
