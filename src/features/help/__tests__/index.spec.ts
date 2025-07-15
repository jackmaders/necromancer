import { type ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";
import { getCommands } from "@/app/config/commands";
import { helpCommand } from "..";
import { buildHelpEmbed } from "../ui/message-payload.ts";

vi.mock("@/app/config/commands");
vi.mock("../ui/message-payload");

describe("Help Command", () => {
	let interaction: MockProxy<ChatInputCommandInteraction>;

	beforeAll(() => {
		interaction = mock<ChatInputCommandInteraction>();
	});

	it("should build and reply with a help embed", async () => {
		const mockEmbed = { title: "Mock Help Embed" };

		vi.mocked(buildHelpEmbed).mockReturnValue(mockEmbed as never);

		await helpCommand.execute(interaction);

		expect(getCommands).toHaveBeenCalledOnce();
		expect(buildHelpEmbed).toHaveBeenCalledWith(
			expect.arrayContaining(getCommands()),
		);
		expect(interaction.reply).toHaveBeenCalledWith({
			embeds: [mockEmbed],
			flags: [MessageFlags.Ephemeral],
		});
	});
});
