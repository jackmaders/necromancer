import { Client, Events } from "discord.js";
import { describe, expect, it, vi } from "vitest";
import { commands } from "@/app/config/commands.ts";
import { logger } from "@/shared/model";
import { InteractionBuilder } from "@/shared/model/index.ts";
import { DiscordClient } from "../discord-client.ts";

describe("DiscordClient", () => {
	const client = new Client({
		intents: [],
	});

	it("should register the ClientReady handler upon instantiation", () => {
		expect.assertions(2);

		new DiscordClient();

		expect(client.once).toHaveBeenCalledTimes(1);
		expect(client.once).toHaveBeenCalledWith(
			Events.ClientReady,
			expect.any(Function),
		);
	});

	it("should call login on the client", async () => {
		expect.assertions(1);
		const token = "my-super-secret-token";

		await new DiscordClient().init(token);

		expect(client.login).toHaveBeenCalledWith(token);
	});

	it("should log the correct message when the ClientReady event is fired", () => {
		expect.assertions(1);

		vi.mocked(client.once).mockImplementation((_event, handler) => {
			handler(client);
			return client;
		});

		new DiscordClient();

		expect(logger.info).toHaveBeenCalledWith(
			"Ready! Logged in as TestBot#1234",
		);
	});

	it("should handle an slash command interaction", async () => {
		expect.assertions(2);

		const interaction = new InteractionBuilder("ping").build();

		let handler = vi.fn();
		vi.mocked(client.on).mockImplementation((_event, listener) => {
			handler = vi.fn(listener);
			return client;
		});

		await new DiscordClient().init("token");

		await handler(interaction);

		expect(commands[0].execute).toHaveBeenCalled();
		expect(commands[0].execute).toHaveBeenCalledWith(interaction);
	});

	it("should handle an invalid interaction type", async () => {
		expect.assertions(2);

		const interaction = new InteractionBuilder("ping").build();

		vi.mocked(interaction.isChatInputCommand).mockReturnValue(false);

		let handler = vi.fn();
		vi.mocked(client.on).mockImplementation((_event, listener) => {
			handler = vi.fn(listener);
			return client;
		});

		await new DiscordClient().init("token");

		const response = await handler(interaction);

		expect(response).toBeUndefined();
		expect(commands[0].execute).not.toHaveBeenCalled();
	});

	it("should handle an invalid command name", async () => {
		expect.assertions(2);

		const interaction = new InteractionBuilder("invalid").build();

		let handler = vi.fn();
		vi.mocked(client.on).mockImplementation((_event, listener) => {
			handler = vi.fn(listener);
			return client;
		});

		await new DiscordClient().init("token");

		const response = await handler(interaction);

		expect(response).toBeUndefined();
		expect(commands[0].execute).not.toHaveBeenCalled();
	});

	it("should handle an command throwing an error", async () => {
		expect.assertions(5);

		const interaction = new InteractionBuilder("ping").build();

		const error = new Error("Unexpected error");
		let handler = vi.fn();
		vi.mocked(client.on).mockImplementation((_event, listener) => {
			handler = vi.fn(listener);
			return client;
		});
		vi.mocked(commands[0].execute).mockRejectedValue(error);

		await new DiscordClient().init("token");
		const response = await handler(interaction);

		expect(response).toBeUndefined();
		expect(logger.error).toHaveBeenCalledTimes(1);
		expect(logger.error).toHaveBeenCalledWith(
			`Error handling interaction (ID: ${interaction.id}):`,
			error,
		);
		expect(interaction.reply).toHaveBeenCalled();
		expect(interaction.reply).toHaveBeenCalledWith({
			content: "There was an error while executing this command!",
			flags: expect.any(Array),
		});
	});

	it("should handle an command throwing an error for an unrepliable message", async () => {
		expect.assertions(4);

		const interaction = new InteractionBuilder("ping").build();
		vi.mocked(interaction.isRepliable).mockReturnValue(false);

		const error = new Error("Unexpected error");
		let handler = vi.fn();
		vi.mocked(client.on).mockImplementation((_event, listener) => {
			handler = vi.fn(listener);
			return client;
		});
		vi.mocked(commands[0].execute).mockRejectedValue(error);

		await new DiscordClient().init("token");
		const response = await handler(interaction);

		expect(response).toBeUndefined();
		expect(logger.error).toHaveBeenCalledTimes(2);
		expect(logger.error).toHaveBeenCalledWith(
			`Error handling interaction (ID: ${interaction.id}):`,
			error,
		);
		expect(logger.error).toHaveBeenCalledWith(
			`Failed to send error reply for interaction ${interaction.id}:`,
			expect.any(Object),
		);
	});

	it("should handle an command throwing an error for a replied message", async () => {
		expect.assertions(5);

		const interaction = new InteractionBuilder("ping").replied().build();

		const error = new Error("Unexpected error");
		let handler = vi.fn();
		vi.mocked(client.on).mockImplementation((_event, listener) => {
			handler = vi.fn(listener);
			return client;
		});
		vi.mocked(commands[0].execute).mockRejectedValue(error);

		await new DiscordClient().init("token");
		const response = await handler(interaction);

		expect(response).toBeUndefined();
		expect(logger.error).toHaveBeenCalledTimes(1);
		expect(logger.error).toHaveBeenCalledWith(
			`Error handling interaction (ID: ${interaction.id}):`,
			error,
		);
		expect(interaction.followUp).toHaveBeenCalled();
		expect(interaction.followUp).toHaveBeenCalledWith({
			content: "There was an error while executing this command!",
			flags: expect.any(Array),
		});
	});
});

vi.mock("discord.js");
vi.mock("../../config/commands.ts");
vi.mock("@/shared/model/logging/logger-client.ts");
