/** biome-ignore-all lint/suspicious/noConsole: bespoke script doesn't need a logging util */
import { type APIApplicationCommand, REST, Routes } from "discord.js";
import { commands } from "@/app/config/commands";
import { env } from "@/shared/config";

/**
 * This script registers all application slash commands with Discord.
 * It should be run whenever a command is added, removed, or changed.
 */
(async () => {
	try {
		console.log(
			`Started deploying ${commands.length} application (/) command(s).`,
		);

		const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = env();

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
