import { beforeEach, describe, expect, it, vi } from "vitest";
import { getUpcomingMonday } from "../get-upcoming-monday.ts";

describe("getUpcomingMonday", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	it("should return the next Monday at midnight UTC", () => {
		vi.setSystemTime(new Date(Date.UTC(2023, 9, 6))); // October 2, 2023 (Monday)
		const expectedMonday = new Date(Date.UTC(2023, 9, 9, 0, 0, 0, 0)); // October 9, 2023

		const result = getUpcomingMonday();
		expect(result).toEqual(expectedMonday);
	});

	it("should handle if the current date is monday", () => {
		vi.setSystemTime(new Date(Date.UTC(2023, 9, 2))); // October 2, 2023 (Monday)
		const expectedMonday = new Date(Date.UTC(2023, 9, 9, 0, 0, 0, 0)); // October 9, 2023

		const result = getUpcomingMonday();
		expect(result).toEqual(expectedMonday);
	});
});
