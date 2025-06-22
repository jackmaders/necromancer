import type { DiscordClient } from "@/app/clients/discord";

declare global {
	var discordClient: DiscordClient | undefined;
}
