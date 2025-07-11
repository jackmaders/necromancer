import { describe, expect, it } from "vitest";
import { getVersionTypeFromCommits } from "../get-version-type.ts";

describe("getVersionTypeFromCommits", () => {
	it("should return 'major' for commits containing 'feat!:'", () => {
		const commits = ["feat!: implement breaking change", "fix: a bug"];
		expect(getVersionTypeFromCommits(commits)).toBe("major");
	});

	it("should return 'minor' if a 'feat:' commit is present without any 'feat!:'", () => {
		const commits = ["feat: add new feature", "docs: update readme"];
		expect(getVersionTypeFromCommits(commits)).toBe("minor");
	});

	it("should prioritize 'major' over 'minor' if both are present", () => {
		const commits = ["feat: add new feature", "feat!: breaking change"];
		expect(getVersionTypeFromCommits(commits)).toBe("major");
	});

	it("should return 'patch' for commits without 'feat!:' or 'feat:'", () => {
		const commits = ["fix: correct a typo", "chore: update dependencies"];
		expect(getVersionTypeFromCommits(commits)).toBe("patch");
	});

	it("should return 'patch' for an empty array of commits", () => {
		const commits: string[] = [];
		expect(getVersionTypeFromCommits(commits)).toBe("patch");
	});
});
