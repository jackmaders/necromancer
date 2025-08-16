import type { ClientEvents, Events } from "discord.js";
import Emittery from "emittery";

type EventMap = {
	[Events.MessagePollVoteAdd]: ClientEvents[Events.MessagePollVoteAdd];
};

export const eventBus = new Emittery<EventMap>();
