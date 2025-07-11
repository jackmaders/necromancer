import { getEnvVar } from "@/shared/config";
import { logger } from "@/shared/model";
import { discord } from "./model/discord-client.ts";

/**
 * Starts the application by initializing the Discord client.
 */
export async function start() {
	try {
		logger.init();
		await discord.init(getEnvVar().DISCORD_TOKEN);
	} catch (error) {
		logger.error(`Error initialising bot: ${error}`);
		if (["production", "test"].includes(getEnvVar().NODE_ENV)) {
			process.exit(1);
		}
	}
}
