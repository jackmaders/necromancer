import { Client, Events } from "discord.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DiscordProvider } from "../discord.ts";

describe("DiscordProvider", () => {
	let provider: DiscordProvider;
	const client = new Client({
		intents: [],
	});

	beforeEach(() => {
		vi.spyOn(console, "log").mockImplementation(() => ({}));
		vi.clearAllMocks();
		provider = new DiscordProvider();
	});

	it("should register the ClientReady handler upon instantiation", () => {
		expect.assertions(2);

		// The handler is registered in the constructor, so we can test it immediately.
		expect(client.once).toHaveBeenCalledTimes(1);
		expect(client.once).toHaveBeenCalledWith(
			Events.ClientReady,
			expect.any(Function),
		);
	});

	it("should call login on the client", async () => {
		expect.assertions(1);
		const token = "my-super-secret-token";

		await provider.login(token);

		expect(client.login).toHaveBeenCalledWith(token);
	});

	it("should log the correct message when the ClientReady event is fired", () => {
		expect.assertions(1);

		vi.mocked(client.once).mockImplementation((_event, handler) => {
			handler(client);
			return client;
		});

		new DiscordProvider();

		// biome-ignore lint/suspicious/noConsole: temporary logging
		expect(console.log).toHaveBeenCalledWith(
			"Ready! Logged in as TestBot#1234",
		);
	});
});

vi.mock("discord.js");
