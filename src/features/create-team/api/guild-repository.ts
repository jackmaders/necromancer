import { prisma } from "@/shared/model";

export const guildRepository = {
	/**
	 * Finds a guild by its Discord ID, creating it if it doesn't exist.
	 * This ensures that a guild record is always available before proceeding.
	 * @param guildId The Discord ID of the guild.
	 * @returns The persisted guild record.
	 */
	async findOrCreate(guildId: string) {
		return await prisma.guild.upsert({
			create: { guildId },
			update: {},
			where: { guildId },
		});
	},
};
