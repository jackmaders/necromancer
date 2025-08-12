import { describe, expect, it } from "vitest";
import { ParentCommand } from "@/shared/lib";
import { getCommands } from "..";

describe("getCommands", () => {
	it("should return an array of commands", () => {
		const commands = getCommands();

		expect(Array.isArray(commands)).toBe(true);
		expect(commands.length).toBeGreaterThan(0);
		expect(commands[0]).toBeInstanceOf(ParentCommand);
		expect(commands[0].data.name).toBe("team");
	});
});
