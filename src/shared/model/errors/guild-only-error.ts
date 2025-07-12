import type { Interaction } from "discord.js";
import { AppError } from "./app-error.ts";

export class GuildOnlyError extends AppError {
	constructor(interaction: Interaction, options?: ErrorOptions) {
		let commandName = "unknown command";

		if ("commandName" in interaction) {
			commandName = interaction.commandName;
		}

		const display = "This command can only be used in a server.";
		const internal = `GuildOnlyError: ${commandName} command used outside of a guild.`;

		super(display, internal, options);
	}
}
