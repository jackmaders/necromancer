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
	 * Deletes a team record from the database by its CUID.
	 */
	async delete(id: string) {
		return await prisma.team.delete({
			where: {
				id,
			},
		});
	},

	/**
	 * Retrieves a team by its name and parent guild ID.
	 */
	async getByName(guildDbId: string, name: string) {
		return await prisma.team.findUnique({
			where: {
				guildId_name: {
					guildId: guildDbId,
					name,
				},
			},
		});
	},
};
