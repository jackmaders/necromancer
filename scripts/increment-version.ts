import { $, file } from "bun";
import { logger } from "@/shared/model";

type VersionType = "major" | "minor" | "patch";

async function main() {
	try {
		logger.info("🔍 Starting version check...");

		const mainPackageJson = await $`git show origin/main:package.json`.json();
		const mainVersion = mainPackageJson.version;

		if (!mainVersion) {
			throw new Error("Could not retrieve version from main branch.");
		}

		logger.info(`- Version on main branch is: ${mainVersion}`);

		const commitLog = (await $`git log origin/main..HEAD --pretty=format:"%s"`)
			.text()
			.trim();
		const commits = commitLog.split("\n").filter(Boolean);
		logger.info(`- Found ${commits.length} new commit(s) since main.`);

		// 3. Calculate the new version based on those commits
		const versionType = getVersionTypeFromCommits(commits);
		if (!versionType) {
			logger.info("✅ No version-bumping commits found. Exiting.");
			return;
		}
		logger.info(`- Detected change type: ${versionType}`);
		const newCalculatedVersion = incrementVersion(mainVersion, versionType);
		logger.info(`- Calculated next version should be: ${newCalculatedVersion}`);

		// 4. Get the version on the current branch
		const currentBranchVersion = await getVersionFromPackageJson();
		logger.info(`- Version on current branch is: ${currentBranchVersion}`);

		// 5. If the new version is greater, increment the package.json
		if (compareVersions(newCalculatedVersion, currentBranchVersion) > 0) {
			logger.info(
				`🚀 Bumping version from ${currentBranchVersion} to ${newCalculatedVersion}...`,
			);
			// This uses `npm version` which updates package.json and package-lock.json
			// It also creates a commit, which you might want to handle in your CI script.
			$`bunx bumpp ${newCalculatedVersion} --commit "chore(release): 🏷️ bump version to v%s" --no-tag -y`;
			logger.info("✅ Version bumped successfully.");
		} else {
			logger.info("✅ Current branch version is already up-to-date or newer.");
		}
	} catch (error) {
		logger.error(`❌ Error during version increment: ${error}`);
		process.exit(1);
	}
}

/**
 * Gets the version from the package.json file.
 * @returns The current version string.
 */
async function getVersionFromPackageJson(): Promise<string> {
	const packageJson = await file("package.json").json();
	return packageJson.version || "0.0.0";
}

/**
 * Parses commit messages to determine the required version bump.
 * @param commits An array of commit messages.
 * @returns The type of version bump required.
 */
function getVersionTypeFromCommits(commits: string[]): VersionType {
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

/**
 * Increments a semantic version string.
 * @param version The version string (e.g., "1.2.3").
 * @param type The type of increment.
 * @returns The new version string.
 */
function incrementVersion(version: string, type: VersionType): string {
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

/**
 * Compares two semantic version strings.
 * @returns 1 if v1 > v2, -1 if v1 < v2, 0 if they are equal.
 */
function compareVersions(v1: string, v2: string): number {
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

main();
