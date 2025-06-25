import { getEnvVar } from "@/shared/config";
import { logger } from "@/shared/model/logging/LoggerClient.ts";
import { discord } from "./model/DiscordClient.ts";

/**
 * Starts the application by initializing the Discord client.
 */
export async function start() {
	try {
		await discord.init(getEnvVar().DISCORD_TOKEN);
	} catch (error) {
		logger.error(error);
		process.exit(1);
	}
}
