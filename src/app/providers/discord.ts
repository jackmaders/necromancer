import { Client, Events, GatewayIntentBits } from "discord.js";

export const discordClient = new Client({
	intents: [GatewayIntentBits.Guilds],
});

/**
 * Initializes the Discord client by logging in with the provided token.
 */
export async function initializeDiscordClient(token: string) {
	await discordClient.login(token);

	discordClient.once(Events.ClientReady, (readyClient) => {
		// biome-ignore lint/suspicious/noConsole: temporary debug
		console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	});
}
