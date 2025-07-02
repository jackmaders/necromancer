import { prisma } from "@/shared/model/data/prisma-client";

export const teamRepository = {
	/**
	 * Creates a new team record in the database.
	 * @param guildDbId The database CUID of the parent guild.
	 * @param name The name for the new team.
	 * @returns The newly created team record.
	 */
	async create(guildDbId: string, name: string) {
		return await prisma.team.create({
			data: {
				guildId: guildDbId,
				name,
			},
		});
	},
};
