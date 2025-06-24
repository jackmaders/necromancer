/** biome-ignore-all lint/suspicious/noConsole: bespoke script doesn't need a logging util */
import { type APIApplicationCommand, REST, Routes } from "discord.js";
import { commands } from "@/app/config/commands";

/**
 * This script registers all application slash commands with Discord.
 * It should be run whenever a command is added, removed, or changed.
 */
(async () => {
	try {
		console.log(
			`Started deploying ${commands.length} application (/) command(s).`,
		);

		// biome-ignore lint/style/noProcessEnv: only need a subset of vars so avoiding env()
		const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = process.env;

		if (!DISCORD_TOKEN) {
			throw new Error("Missing Environment Variable: DISCORD_TOKEN");
		}
		if (!DISCORD_CLIENT_ID) {
			throw new Error("Missing Environment Variable: DISCORD_CLIENT_ID");
		}

		const rest = new REST().setToken(DISCORD_TOKEN);

		// Transform command definitions into the required JSON format
		const commandsData = commands.map((command) => command.data.toJSON());

		// The "put" method is used to fully refresh all commands with the current set
		const data = (await rest.put(
			Routes.applicationCommands(DISCORD_CLIENT_ID),
			{
				body: commandsData,
			},
		)) as APIApplicationCommand[];

		console.log(
			`Successfully deployed ${data.length} application command(s).\n`,
		);
	} catch (error) {
		console.error("Failed to deploy commands:", error);
		process.exit(1);
	}
})();
