import { env } from "@/shared/config/index.ts";
import { discordClient } from "./clients/discord.ts";

/**
 * Starts the application by initializing the Discord client.
 */
export async function start() {
	try {
		await discordClient.login(env().DISCORD_TOKEN);
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: temporary error handling
		console.error(error);
		process.exit(1);
	}
}
