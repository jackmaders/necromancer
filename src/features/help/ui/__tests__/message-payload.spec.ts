import { describe, expect, it, vi } from "vitest";
import { getCommands } from "@/app/config/commands.ts";
import type { Command } from "@/shared/model";
import { buildHelpEmbed } from "../message-payload.ts";

vi.mock("@/app/config/commands");

describe("Help Embed", () => {
	it("should build an embed with simple and parent commands", () => {
		const commands: Command[] = getCommands().map(addCommandData);

		const embed = buildHelpEmbed(commands);
		const embedData = embed.toJSON();

		expect(embedData.title).toBe("❓ Help - Command List");
		expect(embedData.fields).toHaveLength(2);
		expect(embedData.fields?.[0].name).toBe("/test");
		expect(embedData.fields?.[0].value).toBe("`/test` - A test command");

		expect(embedData.fields?.[1].name).toBe("/ping");
		expect(embedData.fields?.[1].value).toBe("`/ping pong` - A pong command");
	});
});

function addCommandData(command: Command) {
	return {
		...command,
		data: {
			...command.data,
			toJSON: vi.fn(() => ({
				...command.data,
			})),
		},
	} as unknown as Command;
}
