import { EmbedBuilder } from "discord.js";
import type { Command } from "@/shared/lib";

export function buildHelpEmbed(commands: Command[]) {
	const embed = new EmbedBuilder()
		.setTitle("❓ Help - Command List")
		.setDescription("Here is a list of all the commands you can use.")
		.setColor(0x5865f2);

	for (const command of commands) {
		const cmdData = command.data.toJSON();

		const subcommands = cmdData.options?.filter((option) => option.type === 1);

		if (subcommands && subcommands.length > 0) {
			const subCommandList = subcommands
				.map((sub) => `\`/${cmdData.name} ${sub.name}\` - ${sub.description}`)
				.join("\n");
			embed.addFields({
				name: `/${cmdData.name}`,
				value: subCommandList,
			});
		} else {
			embed.addFields({
				name: `/${cmdData.name}`,
				value: `\`/${cmdData.name}\` - ${cmdData.description}`,
			});
		}
	}

	return embed;
}
