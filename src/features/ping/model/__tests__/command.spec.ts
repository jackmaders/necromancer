import type {
	ChatInputCommandInteraction,
	Interaction,
	InteractionResponse,
} from "discord.js";
import { beforeEach, describe, expect, it } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";
import { pingCommand } from "../../index.ts";

describe("Ping Command", () => {
	let interaction: MockProxy<ChatInputCommandInteraction>;

	beforeEach(() => {
		interaction = mock<ChatInputCommandInteraction>();
	});

	it("should export the correct properties", () => {
		expect(pingCommand.data).toBeDefined();
		expect(pingCommand.execute).toBeDefined();
	});

	it("should handle an interaction", async () => {
		const replyInteraction = mock<Interaction>();
		// biome-ignore lint/suspicious/noExplicitAny: overriding readonly property
		(interaction.createdTimestamp as any) = Date.now();
		// biome-ignore lint/suspicious/noExplicitAny: overriding readonly property
		(replyInteraction.createdTimestamp as any) =
			interaction.createdTimestamp + 12;

		interaction.reply.mockImplementation(async () => ({
			...mock<InteractionResponse>(),
			interaction: replyInteraction,
		}));

		await pingCommand.execute(interaction);

		expect(interaction.reply).toHaveBeenCalled();
		expect(interaction.reply).toHaveBeenCalledWith({
			content: "Pinging...",
			withResponse: true,
		});
		expect(interaction.editReply).toHaveBeenCalledWith(
			"Pong! Roundtrip test latency: 12ms",
		);
	});
});
