import {
	type ChatInputCommandInteraction,
	type EmbedBuilder,
	MessageFlags,
} from "discord.js";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";
import { buildHelpEmbed } from "../../ui/message-payload.ts";
import { HelpCommand } from "../index.ts";

vi.mock("../../ui/message-payload");

describe("Help Command", () => {
	let command = new HelpCommand();
	let interaction: MockProxy<ChatInputCommandInteraction>;

	beforeAll(() => {
		command = new HelpCommand();
		interaction = mock<ChatInputCommandInteraction>();
	});

	it("should build and reply with a help embed", async () => {
		const mockEmbed = mock<EmbedBuilder>();

		vi.mocked(buildHelpEmbed).mockReturnValue(mockEmbed);

		await command.execute(interaction, { commands: new Map() });

		expect(interaction.reply).toHaveBeenCalledWith({
			embeds: [mockEmbed],
			flags: [MessageFlags.Ephemeral],
		});
	});
});
