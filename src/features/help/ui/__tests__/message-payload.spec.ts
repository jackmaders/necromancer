import { EmbedBuilder } from "discord.js";
import { describe, expect, it, vi } from "vitest";
import { PingCommand } from "@/features/ping/index.ts";
import { buildHelpEmbed } from "../message-payload.ts";

vi.mock("discord.js");
vi.mock("@/features/ping/index.ts");

describe("Help Embed", () => {
	it("should build an embed with simple and parent commands", () => {
		const commands = [new PingCommand()];

		buildHelpEmbed(commands);
		const embedBuilder = vi.mocked(new EmbedBuilder());

		expect(embedBuilder.setTitle).toHaveBeenCalledWith(
			"❓ Help - Command List",
		);
		expect(embedBuilder.setDescription).toHaveBeenCalledWith(
			"Here is a list of all the commands you can use.",
		);
		expect(embedBuilder.setColor).toHaveBeenCalledWith(0x5865f2);

		expect(embedBuilder.addFields).toHaveBeenCalledWith({
			name: "/ping",
			value: "`/ping` - A pong command",
		});
	});
});
