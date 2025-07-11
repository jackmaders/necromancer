import { $, file } from "bun";
import { logger } from "@/shared/model";
import { compareVersions } from "./utils/compare-versions.ts";
import { getVersionTypeFromCommits } from "./utils/get-version-type.ts";
import { incrementVersion } from "./utils/increment-version.ts";

export async function main() {
	try {
		logger.info("🔍 Starting version check...");

		const mainPackageJson = await $`git show origin/main:package.json`.json();
		const mainVersion = mainPackageJson.version;

		logger.info(`- Version on main branch is: ${mainVersion}`);

		const commitLog = (await $`git log origin/main..HEAD --pretty=format:"%s"`)
			.text()
			.trim();
		const commits = commitLog.split("\n").filter(Boolean);
		logger.info(`- Found ${commits.length} new commit(s) since main.`);

		// 3. Calculate the new version based on those commits
		const versionType = getVersionTypeFromCommits(commits);

		logger.info(`- Detected change type: ${versionType}`);
		const newCalculatedVersion = incrementVersion(mainVersion, versionType);
		logger.info(`- Calculated next version should be: ${newCalculatedVersion}`);

		// 4. Get the version on the current branch
		const currentBranchVersion = (await file("package.json").json()).version;

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

// biome-ignore lint/style/noProcessEnv: checking for test scenario
if (process.env.NODE_ENV !== "test") {
	await main();
}
