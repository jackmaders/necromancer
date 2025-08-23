import type { PollData } from "discord.js";
import { getUpcomingMonday } from "@/shared/lib";

/**
 * Builds the availability poll for the upcoming week.
 */
export function buildAvailabilityPoll(): PollData {
	const nextMonday = getUpcomingMonday();

	const weekdays = Array.from({ length: 7 }, (_, index) => {
		const date = new Date(nextMonday);
		date.setDate(nextMonday.getDate() + index);
		return date;
	});

	const dataTimeOptions: Intl.DateTimeFormatOptions = {
		day: "numeric",
		month: "short",
		weekday: "short",
		year: "numeric",
	};

	const answers = weekdays.map((date, index) => ({
		emoji: `${index + 1}\uFE0F\u20E3`,
		text: date.toLocaleDateString("en-GB", dataTimeOptions),
	}));

	const nextMondayFormatted = nextMonday.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
	});

	// Poll should expire on the upcoming Sunday
	const durationMilliseconds = nextMonday.getTime() - Date.now();
	const durationHours = Math.floor(durationMilliseconds / (1000 * 60 * 60));

	return {
		allowMultiselect: true,
		answers,
		duration: durationHours,
		question: {
			text: `Availability: Week of ${nextMondayFormatted}`,
		},
	};
}
