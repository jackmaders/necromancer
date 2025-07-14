import { type InteractionReplyOptions, MessageFlags } from "discord.js";

export function buildReplyOptions(teamName: string): InteractionReplyOptions {
	return {
		content: `Team "${teamName}" has been successfully created! You can now configure it using other \`/team\` subcommands.`,
		flags: [MessageFlags.Ephemeral],
	};
}
