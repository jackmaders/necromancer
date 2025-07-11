export type VersionType = "major" | "minor" | "patch";

/**
 * Parses commit messages to determine the required version bump.
 * @param commits An array of commit messages.
 * @returns The type of version bump required.
 */
export function getVersionTypeFromCommits(commits: string[]): VersionType {
	let versionType: VersionType = "patch";

	for (const commit of commits) {
		if (commit.includes("feat!:")) {
			return "major";
		}
		if (commit.includes("feat:")) {
			versionType = "minor";
		}
	}

	return versionType;
}
