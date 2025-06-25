import { type APIApplicationCommand, REST, Routes } from "discord.js";
import { commands } from "@/app/config/commands";
import { logger } from "@/shared/model/logging/LoggerClient";

/**
 * This script registers all application slash commands with Discord.
 * It should be run whenever a command is added, removed, or changed.
 */
(async () => {
	try {
		logger.info(`Deploying ${commands.length} command(s)...`);

		// biome-ignore lint/style/noProcessEnv: only need a subset of variables so avoiding getEnvVar()
		const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = process.env;

		if (!DISCORD_TOKEN) {
			throw new Error("Missing Environment Variable: DISCORD_TOKEN");
		}
		if (!DISCORD_CLIENT_ID) {
			throw new Error("Missing Environment Variable: DISCORD_CLIENT_ID");
		}

		const rest = new REST().setToken(DISCORD_TOKEN);

		const commandsData = commands.map((command) => command.data.toJSON());

		const data = (await rest.put(
			Routes.applicationCommands(DISCORD_CLIENT_ID),
			{
				body: commandsData,
			},
		)) as APIApplicationCommand[];

		logger.info(`Successfully deployed ${data.length} command(s).`);
	} catch (error) {
		logger.error("Failed to deploy commands:", error);
		process.exit(1);
	}
})();
