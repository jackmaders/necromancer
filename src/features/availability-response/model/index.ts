import type { ClientEvents, Events } from "discord.js";
import { AvailabilityStatus } from "prisma/generated/prisma-client-js";
import { availabilityService } from "@/entities/availability";

export async function handleAvailabilityResponse([
	pollAnswer,
	playerDiscordId,
]: ClientEvents[Events.MessagePollVoteAdd]) {
	const poll = await availabilityService.getPollByMessageId(
		pollAnswer.poll.message.id,
	);

	// If we aren't tracking this poll, ignore the vote
	if (!poll) {
		return;
	}

	// Day index is 0-based, while Discord poll answer IDs are 1-based
	const dayIndex = pollAnswer.id - 1;

	const status = AvailabilityStatus.Available;

	await availabilityService.handleVote(
		poll.id,
		playerDiscordId,
		dayIndex,
		status,
	);
}
