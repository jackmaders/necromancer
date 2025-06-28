import type { ChatInputCommandInteraction } from "discord.js";
import { describe, expect, it } from "vitest";
import { InteractionBuilder } from "../interaction-builder.ts";

describe("Interaction Builder", () => {
	it("should create an interaction", () => {
		const interaction = new InteractionBuilder().build();

		expect(interaction).toHaveProperty("createdTimestamp");
		expect(interaction).toHaveProperty("id");
		expect(interaction).toHaveProperty("commandName");
		expect(interaction).toHaveProperty("deferred");
		expect(interaction).toHaveProperty("replied");
		expect(interaction).toHaveProperty("isChatInputCommand");
		expect(interaction).toHaveProperty("isRepliable");
	});

	it("should create a deferred interaction", () => {
		const interaction = new InteractionBuilder().deferred().build();
		expect(interaction.deferred).toBeTruthy();
	});

	it("should create a replied interaction", () => {
		const interaction = new InteractionBuilder().replied().build();
		expect(interaction.replied).toBeTruthy();
	});

	it("should create a delayed interaction", async () => {
		const delay = 10;
		const interaction = new InteractionBuilder()
			.withReplyLatency(delay)
			.build();
		const interactionTimestamp = interaction.createdTimestamp;
		const replyTimestamp = (await interaction.reply({ fetchReply: true }))
			.createdTimestamp;

		expect(replyTimestamp - interactionTimestamp).toBe(delay);
	});

	it("should create a delayed interaction with no reply", async () => {
		const delay = 10;
		const interaction = new InteractionBuilder()
			.withReplyLatency(delay)
			.build();
		const replyTimestamp = (await interaction.reply({})).createdTimestamp;

		expect(replyTimestamp).toBeUndefined();
	});

	it("should create an interaction with overridden properties", () => {
		const overrides = {
			id: "12341234",
		} as Partial<ChatInputCommandInteraction>;
		const interaction = new InteractionBuilder().with(overrides).build();

		expect(interaction.id).toBe(overrides.id);
	});
});
