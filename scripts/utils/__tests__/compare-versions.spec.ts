import { describe, expect, it } from "vitest";
import { compareVersions } from "../compare-versions.ts";

describe("compareVersions", () => {
	it("should return 1 when the first version is greater", () => {
		expect(compareVersions("1.2.3", "1.2.2")).toBe(1);
		expect(compareVersions("1.3.0", "1.2.9")).toBe(1);
		expect(compareVersions("2.0.0", "1.9.9")).toBe(1);
	});

	it("should return -1 when the second version is greater", () => {
		expect(compareVersions("1.2.2", "1.2.3")).toBe(-1);
		expect(compareVersions("1.2.9", "1.3.0")).toBe(-1);
		expect(compareVersions("1.9.9", "2.0.0")).toBe(-1);
	});

	it("should return 0 when versions are equal", () => {
		expect(compareVersions("1.2.3", "1.2.3")).toBe(0);
	});

	it("should handle versions with different numbers of components", () => {
		expect(compareVersions("1.0", "1.0.0")).toBe(0);
		expect(compareVersions("1.0.1", "1.0")).toBe(1);
		expect(compareVersions("1.0", "1.0.1")).toBe(-1);
	});
});
