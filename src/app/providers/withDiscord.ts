import { Client, Events, GatewayIntentBits } from "discord.js";
import { env } from "@/shared/config";

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, (readyClient) => {
	// biome-ignore lint/suspicious/noConsole: temporary debug
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

export const withDiscord = () => {
	client.login(env.DISCORD_TOKEN);
};
