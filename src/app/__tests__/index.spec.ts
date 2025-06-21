import { beforeAll, describe, expect, it, vi } from "vitest";
import { start } from "..";
import { initializeDiscordClient } from "../providers/discord.ts";

describe("Discord Bot Entrypoint", () => {
	beforeAll(() => {
		vi.spyOn(console, "error").mockImplementation(() => console);
		vi.spyOn(process, "exit").mockImplementation(() => ({}) as never);
	});

	it("should init the discord client", async () => {
		expect.assertions(2);

		await start();

		expect(initializeDiscordClient).toHaveBeenCalledTimes(1);
		expect(initializeDiscordClient).toHaveBeenCalledWith("DISCORD_TOKEN");
	});

	it("should handle an error", async () => {
		expect.assertions(4);
		vi.mocked(initializeDiscordClient).mockRejectedValueOnce(
			new Error("Discord client error"),
		);

		await start();

		// biome-ignore lint/suspicious/noConsole: temporary debug
		expect(console.error).toHaveBeenCalledTimes(1);
		// biome-ignore lint/suspicious/noConsole: temporary debug
		expect(console.error).toHaveBeenCalledWith(
			new Error("Discord client error"),
		);
		expect(process.exit).toHaveBeenCalledTimes(1);
		expect(process.exit).toHaveBeenCalledWith(1);
	});
});

vi.mock("@/shared/config/env.ts");
vi.mock("../providers/discord.ts");
