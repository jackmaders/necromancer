import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { discordClient, initializeDiscordClient } from "../discord.ts";

const token = "my-super-secret-token";

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

		expect(discordClient.login).toHaveBeenCalledOnce();
		expect(discordClient.login).toHaveBeenCalledWith(token);
	});

	it("should propagate errors if login fails", async () => {
		expect.assertions(1);

		const error = new Error("Invalid Token");
		vi.mocked(discordClient.login).mockRejectedValue(error);

		await expect(initializeDiscordClient(token)).rejects.toThrow(error);
	});

	it("should register a listener for the ClientReady event upon import", async () => {
		expect.assertions(2);
		const token = "my-super-secret-token";

		await initializeDiscordClient(token);
		expect(discordClient.once).toHaveBeenCalledOnce();
		expect(discordClient.once).toHaveBeenCalledWith(
			"ready",
			expect.any(Function),
		);
	});

	it("should log the correct message when the ClientReady event is fired", async () => {
		vi.mocked(discordClient.once).mockImplementation((_, fn) => {
			fn(discordClient);
			return discordClient;
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
