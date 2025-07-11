import { beforeEach, describe, expect, it, vi } from "vitest";
import { logger } from "@/shared/model/index.ts";
import { main } from "../increment-version.ts";
import { compareVersions } from "../utils/compare-versions.ts";
import { getVersionTypeFromCommits } from "../utils/get-version-type.ts";

vi.mock("bun");
vi.mock("@/shared/model/logging/logger-client.ts");
vi.mock("../utils/get-version-type.ts");
vi.mock("../utils/compare-versions.ts");

describe("main", () => {
	beforeEach(() => {
		vi.spyOn(process, "exit").mockImplementation(() => ({}) as never);
	});

	it("should perform a major version bump when a 'feat!' commit is found", async () => {
		vi.mocked(getVersionTypeFromCommits).mockReturnValue("major");
		vi.mocked(compareVersions).mockReturnValue(1);

		await main();

		expect(logger.info).toHaveBeenCalledWith(
			"🚀 Bumping version from 1.0.0 to 2.0.0...",
		);
		expect(logger.info).toHaveBeenCalledWith("✅ Version bumped successfully.");
		expect(process.exit).not.toHaveBeenCalled();
	});

	it("should perform a minor version bump when a 'feat' commit is found", async () => {
		vi.mocked(getVersionTypeFromCommits).mockReturnValue("minor");
		vi.mocked(compareVersions).mockReturnValue(1);

		await main();

		expect(logger.info).toHaveBeenCalledWith(
			"🚀 Bumping version from 1.0.0 to 1.1.0...",
		);
		expect(logger.info).toHaveBeenCalledWith("✅ Version bumped successfully.");
		expect(process.exit).not.toHaveBeenCalled();
	});

	it("should perform a patch version bump when a no commit marker is found", async () => {
		vi.mocked(getVersionTypeFromCommits).mockReturnValue("patch");
		vi.mocked(compareVersions).mockReturnValue(1);

		await main();

		expect(logger.info).toHaveBeenCalledWith(
			"🚀 Bumping version from 1.0.0 to 1.0.1...",
		);
		expect(logger.info).toHaveBeenCalledWith("✅ Version bumped successfully.");
		expect(process.exit).not.toHaveBeenCalled();
	});

	it("should handle if version is already up to date", async () => {
		vi.mocked(getVersionTypeFromCommits).mockReturnValue("patch");
		vi.mocked(compareVersions).mockReturnValue(-1);

		await main();

		expect(logger.info).toHaveBeenCalledWith(
			"✅ Current branch version is already up-to-date or newer.",
		);
		expect(process.exit).not.toHaveBeenCalled();
	});

	it("should handle an unexpected error", async () => {
		const error = new Error("Unexpected Error");
		vi.mocked(getVersionTypeFromCommits).mockImplementation(() => {
			throw error;
		});

		await main();

		expect(logger.error).toHaveBeenCalledWith(
			"❌ Error during version increment: Error: Unexpected Error",
		);
		expect(process.exit).toHaveBeenCalled();
	});

	it("should execute the function on import for non-test environments", async () => {
		vi.mocked(getVersionTypeFromCommits).mockReturnValue("minor");
		vi.mocked(compareVersions).mockReturnValue(1);

		vi.stubEnv("NODE_ENV", "production");
		vi.resetModules();

		await import("../increment-version.ts");
		const { logger } = await import("@/shared/model");

		expect(logger.info).toHaveBeenCalledWith(
			"🚀 Bumping version from 1.0.0 to 1.1.0...",
		);

		expect(logger.info).toHaveBeenCalledWith("✅ Version bumped successfully.");
		expect(process.exit).not.toHaveBeenCalled();
	});
});
