import { type ChatInputCommandInteraction, Client, Events } from "discord.js";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";
import { getCommands } from "@/app/config";
import { eventBus } from "@/shared/lib/index.ts";
import { logger } from "@/shared/lib/logging/logger-client.ts";
import type { AppContext } from "@/shared/model";
import { AppError } from "@/shared/model";
import { DiscordClient } from "../discord-client.ts";

vi.mock("discord.js");
vi.mock("@/app/config");
vi.mock("@/shared/lib/logging/logger-client.ts");

describe("DiscordClient", () => {
	let interaction: MockProxy<ChatInputCommandInteraction>;
	let context: MockProxy<AppContext>;
	let handlers = new Map<
		string | symbol,
		(...args: unknown[]) => Promise<void>
	>();

	const client = new Client({
		intents: [],
	});

	beforeEach(() => {
		interaction = mock<ChatInputCommandInteraction>();
		interaction.commandName = "ping";
		interaction.isChatInputCommand.mockReturnValue(true);
		interaction.isRepliable.mockReturnValue(true);
		context = { commands: new Map() };
		handlers = new Map();

		vi.mocked(client.on).mockImplementation((_event, listener) => {
			handlers.set(_event, async (...args) => listener(...args));
			return client;
		});
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

	it("should handle a slash command interaction", async () => {
		expect.assertions(2);

		for (const command of getCommands()) {
			context.commands.set(command.data.name, command);
		}

		await new DiscordClient().init("token");

		await handlers.get(Events.InteractionCreate)?.(interaction);

		expect(getCommands()[0].execute).toHaveBeenCalled();
		expect(getCommands()[0].execute).toHaveBeenCalledWith(interaction, context);
	});

	it("should handle a MessagePollVoteAdd", async () => {
		expect.assertions(1);

		const handler = vi.fn();
		eventBus.on(Events.MessagePollVoteAdd, handler);

		await new DiscordClient().init("token");

		await handlers.get(Events.MessagePollVoteAdd)?.("pollAnswer", "userId");

		expect(handler).toHaveBeenCalledWith(["pollAnswer", "userId"]);
	});

	it("should handle an autocomplete command interaction", async () => {
		expect.assertions(2);

		for (const command of getCommands()) {
			context.commands.set(command.data.name, command);
		}

		interaction.isAutocomplete.mockReturnValue(true);
		interaction.isChatInputCommand.mockReturnValue(false);

		await new DiscordClient().init("token");

		await handlers.get(Events.InteractionCreate)?.(interaction);

		expect(getCommands()[0].autocomplete).toHaveBeenCalled();
		expect(getCommands()[0].autocomplete).toHaveBeenCalledWith(
			interaction,
			context,
		);
	});

	it("should handle an unknown interaction type", async () => {
		expect.assertions(2);

		interaction.isAutocomplete.mockReturnValue(false);
		interaction.isChatInputCommand.mockReturnValue(false);

		await new DiscordClient().init("token");

		const response = await handlers.get(Events.InteractionCreate)?.(
			interaction,
		);

		expect(response).toBeUndefined();
		expect(getCommands()[0].execute).not.toHaveBeenCalled();
	});

	it("should handle an invalid command name", async () => {
		expect.assertions(2);

		interaction.commandName = "invalid";

		await new DiscordClient().init("token");

		const response = await handlers.get(Events.InteractionCreate)?.(
			interaction,
		);

		expect(response).toBeUndefined();
		expect(getCommands()[0].execute).not.toHaveBeenCalled();
	});

	it("should handle an command throwing an error", async () => {
		expect.assertions(5);

		const error = new Error("Unexpected error");

		vi.mocked(getCommands()[0].execute).mockRejectedValue(error);

		await new DiscordClient().init("token");
		const response = await handlers.get(Events.InteractionCreate)?.(
			interaction,
		);

		expect(response).toBeUndefined();
		expect(logger.error).toHaveBeenCalledTimes(1);
		expect(logger.error).toHaveBeenCalledWith(
			`Error handling interaction (ID: ${interaction.id}): ${error}`,
		);
		expect(interaction.followUp).toHaveBeenCalled();
		expect(interaction.followUp).toHaveBeenCalledWith({
			content: "There was an error while executing this command!",
			flags: expect.any(Array),
		});
	});

	it("should handle an command throwing an another object", async () => {
		expect.assertions(5);

		const error = "string";
		vi.mocked(getCommands()[0].execute).mockRejectedValue(error);

		await new DiscordClient().init("token");
		const response = await handlers.get(Events.InteractionCreate)?.(
			interaction,
		);

		expect(response).toBeUndefined();
		expect(logger.error).toHaveBeenCalledTimes(1);
		expect(logger.error).toHaveBeenCalledWith(
			`Error handling interaction (ID: ${interaction.id}): ${error}`,
		);
		expect(interaction.followUp).toHaveBeenCalled();
		expect(interaction.followUp).toHaveBeenCalledWith({
			content: "There was an error while executing this command!",
			flags: expect.any(Array),
		});
	});

	it("should handle an command throwing an AppError", async () => {
		expect.assertions(5);

		const error = new AppError("Unexpected error");
		vi.mocked(getCommands()[0].execute).mockRejectedValue(error);

		await new DiscordClient().init("token");
		const response = await handlers.get(Events.InteractionCreate)?.(
			interaction,
		);

		expect(response).toBeUndefined();
		expect(logger.error).toHaveBeenCalledTimes(1);
		expect(logger.error).toHaveBeenCalledWith(
			`Error handling interaction (ID: ${interaction.id}): ${error}`,
		);
		expect(interaction.followUp).toHaveBeenCalled();
		expect(interaction.followUp).toHaveBeenCalledWith({
			content: "Unexpected error",
			flags: expect.any(Array),
		});
	});

	it("should handle an command throwing an error for an unrepliable message", async () => {
		expect.assertions(4);

		interaction.isRepliable.mockReturnValue(false);

		const error = new Error("Unexpected error");
		vi.mocked(getCommands()[0].execute).mockRejectedValue(error);

		await new DiscordClient().init("token");
		const response = await handlers.get(Events.InteractionCreate)?.(
			interaction,
		);

		expect(response).toBeUndefined();
		expect(logger.error).toHaveBeenCalledTimes(2);
		expect(logger.error).toHaveBeenCalledWith(
			`Error handling interaction (ID: ${interaction.id}): ${error}`,
		);
		expect(logger.error).toHaveBeenCalledWith(
			`Failed to send error reply for interaction ${interaction.id}: Error: Interaction is not repliable`,
		);
	});

	it("should handle an command throwing an error for an un replied message", async () => {
		expect.assertions(5);

		interaction.replied = false;
		interaction.deferred = false;

		const error = new Error("Unexpected error");
		vi.mocked(getCommands()[0].execute).mockRejectedValue(error);

		await new DiscordClient().init("token");
		const response = await handlers.get(Events.InteractionCreate)?.(
			interaction,
		);

		expect(response).toBeUndefined();
		expect(logger.error).toHaveBeenCalledTimes(1);
		expect(logger.error).toHaveBeenCalledWith(
			`Error handling interaction (ID: ${interaction.id}): ${error}`,
		);
		expect(interaction.reply).toHaveBeenCalled();
		expect(interaction.reply).toHaveBeenCalledWith({
			content: "There was an error while executing this command!",
			flags: expect.any(Array),
		});
	});
});
