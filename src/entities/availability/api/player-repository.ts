import { prisma } from "@/shared/model";

export const playerRepository = {
	/**
	 * Finds or creates a user by their Discord ID.
	 * @param discordId The user's Discord ID.
	 */
	async findOrCreatePlayer(discordId: string) {
		return await prisma.player.upsert({
			create: { discordId },
			update: {},
			where: { discordId },
		});
	},
};
