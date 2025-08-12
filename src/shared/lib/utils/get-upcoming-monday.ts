export function getUpcomingMonday() {
	const today = new Date();
	today.setUTCHours(0, 0, 0, 0);

	const currentDay = today.getUTCDay();

	const daysToAdd = 8 - currentDay;

	const nextMonday = new Date(today);
	nextMonday.setUTCDate(
		today.getUTCDate() + (daysToAdd % 7 === 0 ? 7 : daysToAdd % 7),
	);

	return nextMonday;
}
