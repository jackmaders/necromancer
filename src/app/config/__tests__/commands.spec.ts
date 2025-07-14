import { describe, expect, it, vi } from "vitest";
import { getCommands } from "../commands.ts";

describe("Commands Registry", () => {
	it("should export an array with the correct properties", () => {
		const commands = getCommands();

		for (const command of commands) {
			expect(command.data).toBeDefined();
			expect(command.execute).toBeDefined();
		}
	});

	it("should handle local-only commands", () => {
		vi.stubEnv("NODE_ENV", "local");
		const commands = getCommands();

		const pingCommand = commands.find((cmd) => cmd.data.name === "ping");
		expect(pingCommand).toBeDefined();
	});
});
