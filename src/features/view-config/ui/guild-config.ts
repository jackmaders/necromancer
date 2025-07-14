import { type ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import type { Team } from "prisma/generated/prisma-client-js";

/**
 * Reply with the team's configuration details.
 */
export function buildGuildConfigEmbed(
	interaction: ChatInputCommandInteraction,
	{ teams }: { teams: Team[] },
) {
	return new EmbedBuilder()
		.setTitle("⚙️ Configuration")
		.setColor(0x5865f2)
		.addFields({
			inline: true,
			name: "Teams",
			value:
				teams
					.map((t) => t.name)
					.join(", ")
					.slice(0, 1020) || "None",
		})
		.setFooter({ text: `Server ID: ${interaction.guild?.id}` });
}
