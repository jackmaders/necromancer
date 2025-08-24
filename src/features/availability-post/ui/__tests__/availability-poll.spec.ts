import { afterEach, describe, expect, it, vi } from "vitest";
import { getUpcomingMonday } from "@/shared/lib";
import { buildAvailabilityPoll } from "../availability-poll.ts";

vi.mock("@/shared/lib", () => ({
	getUpcomingMonday: vi.fn(),
}));

describe("buildAvailabilityPoll", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it("should return PollData with correct structure and values", () => {
		vi.setSystemTime(new Date("2025-08-22T10:00:00Z"));
		const mockMonday = new Date("2025-08-25T00:00:00Z"); // Monday
		vi.mocked(getUpcomingMonday).mockReturnValue(mockMonday);

		const pollData = buildAvailabilityPoll();

		expect(getUpcomingMonday).toHaveBeenCalled();
		expect(pollData).toEqual({
			allowMultiselect: true,
			answers: [
				{
					emoji: "1\uFE0F\u20E3",
					text: "Mon, 25 Aug 2025",
				},
				{
					emoji: "2\uFE0F\u20E3",
					text: "Tue, 26 Aug 2025",
				},
				{
					emoji: "3\uFE0F\u20E3",
					text: "Wed, 27 Aug 2025",
				},
				{
					emoji: "4\uFE0F\u20E3",
					text: "Thu, 28 Aug 2025",
				},
				{
					emoji: "5\uFE0F\u20E3",
					text: "Fri, 29 Aug 2025",
				},
				{
					emoji: "6\uFE0F\u20E3",
					text: "Sat, 30 Aug 2025",
				},
				{
					emoji: "7\uFE0F\u20E3",
					text: "Sun, 31 Aug 2025",
				},
			],
			duration: 62,
			question: {
				text: "Availability: Week of 25 Aug",
			},
		});
	});
});
