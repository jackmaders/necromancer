import { describe, expect, it } from "vitest";
import { incrementVersion } from "../increment-version.ts";

describe("incrementVersion", () => {
	it("should correctly increment the major version", () => {
		expect(incrementVersion("1.2.3", "major")).toBe("2.0.0");
	});

	it("should correctly increment the minor version", () => {
		expect(incrementVersion("1.2.3", "minor")).toBe("1.3.0");
	});

	it("should correctly increment the patch version", () => {
		expect(incrementVersion("1.2.3", "patch")).toBe("1.2.4");
	});

	it("should handle version '0.0.0' correctly", () => {
		expect(incrementVersion("0.0.0", "major")).toBe("1.0.0");
		expect(incrementVersion("0.0.0", "minor")).toBe("0.1.0");
		expect(incrementVersion("0.0.0", "patch")).toBe("0.0.1");
	});

	it("should handle version a null type correctly", () => {
		expect(incrementVersion("0.0.0", null as never)).toBe("0.0.0");
	});
});
