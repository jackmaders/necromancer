import type { VersionType } from "./get-version-type.ts";

/**
 * Increments a semantic version string.
 * @param version The version string (e.g., "1.2.3").
 * @param type The type of increment.
 * @returns The new version string.
 */
export function incrementVersion(version: string, type: VersionType): string {
	const [major, minor, patch] = version.split(".").map(Number);

	switch (type) {
		case "major":
			return `${major + 1}.0.0`;
		case "minor":
			return `${major}.${minor + 1}.0`;
		case "patch":
			return `${major}.${minor}.${patch + 1}`;
		default:
			return version;
	}
}
