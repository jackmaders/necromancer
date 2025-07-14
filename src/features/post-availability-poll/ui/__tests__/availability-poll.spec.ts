import { beforeAll, describe, expect, it, vi } from "vitest";
import { buildAvailabilityPoll } from "../availability-poll.ts";

describe("Availability Poll Embed Replies", () => {
	beforeAll(() => {
		vi.useFakeTimers();
	});

	it("should build an availability poll", () => {
		vi.setSystemTime(new Date(Date.UTC(2023, 9, 6))); // October 2, 2023 (Monday)
		const poll = buildAvailabilityPoll();

		expect(poll).toEqual({
			allowMultiselect: true,
			answers: [
				{
					emoji: "1\uFE0F\u20E3",
					text: "Mon 9 Oct",
				},
				{
					emoji: "2\uFE0F\u20E3",
					text: "Tue 10 Oct",
				},
				{
					emoji: "3\uFE0F\u20E3",
					text: "Wed 11 Oct",
				},
				{
					emoji: "4\uFE0F\u20E3",
					text: "Thu 12 Oct",
				},
				{
					emoji: "5\uFE0F\u20E3",
					text: "Fri 13 Oct",
				},
				{
					emoji: "6\uFE0F\u20E3",
					text: "Sat 14 Oct",
				},
				{
					emoji: "7\uFE0F\u20E3",
					text: "Sun 15 Oct",
				},
			],
			duration: 72,
			question: {
				text: "Availability: Week of 9 Oct",
			},
		});
	});
});
