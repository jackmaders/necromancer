import { prisma } from "@/shared/model";

export const teamRepository = {
	/**
	 * Creates a new team record in the database.
	 */
	async create(guildDbId: string, name: string) {
		return await prisma.team.create({
			data: {
				guildId: guildDbId,
				name,
			},
		});
	},

	/**
	 * Deletes a team record from the database by its name and parent guild ID.
	 */
	async deleteByName(guildDbId: string, name: string) {
		return await prisma.team.delete({
			where: {
				// biome-ignore lint/style/useNamingConvention: snake case used for indexes
				guildId_name: {
					guildId: guildDbId,
					name,
				},
			},
		});
	},

	/**
	 * Retrieves a team by its name and parent guild ID.
	 */
	async findAllByGuildId(guildDbId: string) {
		return await prisma.team.findMany({
			where: {
				guildId: guildDbId,
			},
		});
	},

	/**
	 * Retrieves a team by its name and parent guild ID.
	 */
	async findByName(guildDbId: string, name: string) {
		return await prisma.team.findUniqueOrThrow({
			where: {
				// biome-ignore lint/style/useNamingConvention: snake case used for indexes
				guildId_name: {
					guildId: guildDbId,
					name,
				},
			},
		});
	},
};
