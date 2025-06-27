import { SlashCommandSubcommandBuilder } from "discord.js";

export const data = new SlashCommandSubcommandBuilder()
	.setName("create")
	.setDescription("Starts a guided setup to create a new team.");
