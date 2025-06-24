import { env } from "@/shared/config";
import { discordClient } from "./clients/discord.ts";

/**
 * Starts the application by initializing the Discord client.
 */
export async function start() {
	try {
		await discordClient.init(env().DISCORD_TOKEN);
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: temporary error handling
		console.error(error);
		process.exit(1);
	}
}
