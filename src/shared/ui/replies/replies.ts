import { type ChatInputCommandInteraction, MessageFlags } from "discord.js";

/**
 * Reply for when a command is used outside of a server.
 */
export async function replyWithGuildOnlyCommandWarn(
	interaction: ChatInputCommandInteraction,
) {
	return await interaction.reply({
		content: "This command can only be used in a server.",
		flags: [MessageFlags.Ephemeral],
	});
}

/**
 * Reply for when a team with the given name already exists.
 */
export async function replyWithErrorMessage(
	interaction: ChatInputCommandInteraction,
	error: Error,
) {
	return await interaction.reply({
		content: error.message,
		flags: [MessageFlags.Ephemeral],
	});
}
