import { describe, expect, it } from "vitest";
import { InteractionBuilder } from "@/shared/model/index.ts";
import { pingCommand } from "../command.ts";

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
			fetchReply: true,
		});
		expect(interaction.editReply).toHaveBeenCalledWith(
			"Pong! Roundtrip test latency: 12ms",
		);
	});
});
