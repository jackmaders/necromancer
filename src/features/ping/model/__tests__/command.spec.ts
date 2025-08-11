import type {
	ChatInputCommandInteraction,
	Interaction,
	InteractionResponse,
} from "discord.js";
import { beforeEach, describe, expect, it } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";
import { PingCommand } from "../command.ts";

describe("Ping Command", () => {
	let interaction: MockProxy<ChatInputCommandInteraction>;

	beforeEach(() => {
		interaction = mock<ChatInputCommandInteraction>();
	});

	it("should export the correct properties", () => {
		const command = new PingCommand();

		expect(command.data).toBeDefined();
		expect(command.execute).toBeDefined();
	});

	it("should handle an interaction", async () => {
		const command = new PingCommand();
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

		await command.execute(interaction);

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
