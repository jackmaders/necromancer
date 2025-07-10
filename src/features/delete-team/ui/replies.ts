import { type ChatInputCommandInteraction, MessageFlags } from "discord.js";

/**
 * Reply for when a team is created deleted.
 */
export async function replyWithTeamDeleted(
	interaction: ChatInputCommandInteraction,
	teamName: string,
) {
	return await interaction.reply({
		content: `Team "${teamName}" has been successfully deleted!`,
		flags: [MessageFlags.Ephemeral],
	});
}
