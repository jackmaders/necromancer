import type { ClientEvents, Events } from "discord.js";
import { AvailabilityStatus } from "prisma/generated/prisma-client-js";
import { availabilityService } from "@/entities/availability";

export async function handleAvailabilityResponse([
	pollAnswer,
	playerDiscordId,
]: ClientEvents[Events.MessagePollVoteAdd]) {
	const dayIndex = pollAnswer.id - 1;

	// For now, we'll assume any vote means "Available".
	const status = AvailabilityStatus.Available;

	await availabilityService.handleVote(
		pollAnswer.poll.message.id,
		playerDiscordId,
		dayIndex,
		status,
	);
}
