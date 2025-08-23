import { playerRepository } from "../api/player-repository.ts";

export const playerService = {
	ensureExists(discordId: string) {
		return playerRepository.findOrCreatePlayer(discordId);
	},
};
