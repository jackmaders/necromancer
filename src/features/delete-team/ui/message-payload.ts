import { type InteractionReplyOptions, MessageFlags } from "discord.js";

export function buildReplyOptions(teamName: string): InteractionReplyOptions {
	return {
		content: `Team "${teamName}" has been successfully deleted!`,
		flags: [MessageFlags.Ephemeral],
	};
}
