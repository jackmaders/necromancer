import { type ChatInputCommandInteraction, MessageFlags } from "discord.js";

/**
 * Reply for when a team is created successfully.
 */
export async function replyWithTeamCreated(
	interaction: ChatInputCommandInteraction,
	teamName: string,
) {
	return await interaction.reply({
		content: `Team "${teamName}" has been successfully created! You can now configure it using other \`/team\` subcommands.`,
		flags: [MessageFlags.Ephemeral],
	});
}
