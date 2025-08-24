import { Events } from "discord.js";
import { describe, expect, it, vi } from "vitest";
import { handleAvailabilityResponse } from "@/features/availability-response";
import { eventBus } from "@/shared/lib";
import { setupEventHandlers } from "../events.ts";

describe("setupEventHandlers", () => {
	it("should register handleAvailabilityResponse to MessagePollVoteAdd event", () => {
		vi.mock("@/shared/lib", () => ({
			eventBus: {
				on: vi.fn(),
			},
		}));
		vi.mock("@/features/availability-response", () => ({
			handleAvailabilityResponse: vi.fn(),
		}));

		setupEventHandlers();

		expect(eventBus.on).toHaveBeenCalledWith(
			Events.MessagePollVoteAdd,
			handleAvailabilityResponse,
		);
	});
});
