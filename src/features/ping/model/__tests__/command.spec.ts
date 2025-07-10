import { describe, expect, it } from "vitest";
import { InteractionBuilder } from "@/testing/interaction-builder.ts";
import { pingCommand } from "../../index.ts";

describe("Ping Command", () => {
	it("should export the correct properties", () => {
		expect(pingCommand.data).toBeDefined();
		expect(pingCommand.execute).toBeDefined();
	});

	it("should handle an interaction", async () => {
		const interaction = new InteractionBuilder("ping")
			.withReplyLatency(12)
			.build();

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
