import { EmbedBuilder } from "discord.js";
import { describe, expect, it, vi } from "vitest";
import { getCommands } from "@/app/config"; // Use the mock with a parent command
import { buildHelpEmbed } from "../message-payload.ts";

vi.mock("discord.js");
vi.mock("@/features/ping");
vi.mock("@/app/config");

describe("Help Embed", () => {
	it("should build an embed with a simple command", () => {
		buildHelpEmbed(getCommands());
		const embedBuilder = vi.mocked(new EmbedBuilder());

		expect(embedBuilder.addFields).toHaveBeenCalledWith({
			name: "/ping",
			value: "`/ping` - A pong command",
		});

		expect(embedBuilder.addFields).toHaveBeenCalledWith({
			name: "/team",
			value: "`/team create` - Create a team",
		});
	});
});
