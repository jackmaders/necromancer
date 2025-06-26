import { describe, expect, it } from "vitest";
import { commands } from "../commands/index.ts";

describe("Commands Registry", () => {
	it("should export an array with the correct properties", () => {
		for (const command of commands) {
			expect(command.data).toBeDefined();
			expect(command.execute).toBeDefined();
		}
	});
});
