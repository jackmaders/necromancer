/**
 * Compares two semantic version strings.
 * @returns 1 if v1 > v2, -1 if v1 < v2, 0 if they are equal.
 */
export function compareVersions(v1: string, v2: string): number {
	const parts1 = v1.split(".").map(Number);
	const parts2 = v2.split(".").map(Number);
	const length = Math.max(parts1.length, parts2.length);

	for (const i of Array.from({ length }, (_, i) => i)) {
		const p1 = parts1[i] || 0;
		const p2 = parts2[i] || 0;
		if (p1 > p2) {
			return 1;
		}
		if (p1 < p2) {
			return -1;
		}
	}
	return 0;
}
