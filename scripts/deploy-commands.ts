import { type APIApplicationCommand, REST, Routes } from "discord.js";
import { commands } from "@/app/config/commands";
import { getEnvVar } from "@/shared/config/env";
import { logger } from "@/shared/model/logging/logger-client";

/**
 * This script registers all application slash commands with Discord.
 * It should be run whenever a command is added, removed, or changed.
 */
export async function deployCommands() {
	try {
		logger.info(`Deploying ${commands.length} command(s)...`);

		// Passing true bypasses error handling for missing vars
		// Since not all vars are present in GHA, but we still need token and client id
		const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = getEnvVar(true);

		// Still need to check each var since we can't be 100% these are available
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
}

// biome-ignore lint/style/noProcessEnv: checking for test scenario
if (process.env.NODE_ENV !== "test") {
	deployCommands();
}
