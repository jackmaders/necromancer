import { env } from "@/shared/config/env.ts";
import { initializeDiscordClient } from "./providers/discord.ts";

/**
 * Starts the application by initializing the Discord client.
 */
export async function start() {
	try {
		await initializeDiscordClient(env().DISCORD_TOKEN);
	} catch (error) {
		// biome-ignore lint/suspicious/noConsole: temporary error handling
		console.error(error);
		process.exit(1);
	}
}
