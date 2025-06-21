import { Client } from "discord.js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { initializeDiscordClient } from "../discord.ts";

const token = "my-super-secret-token";
const client = new Client({
	intents: [],
});

describe("discord.ts", () => {
	beforeEach(() => {
		vi.spyOn(console, "log").mockImplementation(() => ({}) as never);
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should call login with the provided token", async () => {
		expect.assertions(2);

		await initializeDiscordClient(token);

		expect(client.login).toHaveBeenCalledOnce();
		expect(client.login).toHaveBeenCalledWith(token);
	});

	it("should propagate errors if login fails", async () => {
		expect.assertions(1);

		const error = new Error("Invalid Token");
		vi.mocked(client.login).mockRejectedValue(error);

		await expect(initializeDiscordClient(token)).rejects.toThrow(error);
	});

	it("should register a listener for the ClientReady event upon import", async () => {
		expect.assertions(2);
		const token = "my-super-secret-token";

		await initializeDiscordClient(token);
		expect(client.once).toHaveBeenCalledOnce();
		expect(client.once).toHaveBeenCalledWith("ready", expect.any(Function));
	});

	it("should log the correct message when the ClientReady event is fired", async () => {
		vi.mocked(client.once).mockImplementation((_, fn) => {
			fn(client);
			return client;
		});

		await initializeDiscordClient(token);

		// biome-ignore lint/suspicious/noConsole: temporary debug
		expect(console.log).toHaveBeenCalledOnce();
		// biome-ignore lint/suspicious/noConsole: temporary debug
		expect(console.log).toHaveBeenCalledWith(
			"Ready! Logged in as TestBot#1234",
		);
	});

	// describe("Event Handling", () => {

	// });
});

vi.mock("discord.js");
