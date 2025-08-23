import { Events } from "discord.js";
import { handleAvailabilityResponse } from "@/features/availability-response";
import { eventBus } from "@/shared/lib";

eventBus.on(Events.MessagePollVoteAdd, handleAvailabilityResponse);
