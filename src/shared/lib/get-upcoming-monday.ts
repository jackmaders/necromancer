/**
 * Calculates the date of the upcoming Monday at midnight UTC.
 * The poll should always be for the next full calendar week.
 */
export function getUpcomingMonday() {
	const today = new Date();
	const currentDay = today.getUTCDay();

	const daysToAdd = 7 - currentDay + 1;

	const nextMonday = new Date(today.toUTCString());
	nextMonday.setUTCDate(
		today.getUTCDate() + (daysToAdd % 7 === 0 ? 7 : daysToAdd % 7),
	);

	nextMonday.setUTCHours(0, 0, 0, 0);

	return nextMonday;
}
