import { Events } from "discord.js";
import { handleAvailabilityResponse } from "@/features/availability-response";
import { eventBus } from "@/shared/lib";

export function setupEventHandlers() {
	eventBus.on(Events.MessagePollVoteAdd, handleAvailabilityResponse);
}
