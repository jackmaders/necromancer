import { beforeEach, describe, expect, it, vi } from "vitest";
import { logger } from "@/shared/lib";
import { start } from "..";
import { discord } from "../model/discord-client.ts";

vi.mock("@/shared/lib");
vi.mock("../model/discord-client.ts");

describe("Discord Bot Entrypoint", () => {
	beforeEach(() => {
		vi.spyOn(process, "exit").mockImplementation(() => ({}) as never);
	});

	it("should init the discord client", async () => {
		expect.assertions(2);

		await start();

		expect(discord.init).toHaveBeenCalledTimes(1);
		expect(discord.init).toHaveBeenCalledWith("your_discord_token");
	});

	it("should handle an error", async () => {
		expect.assertions(4);
		vi.mocked(discord.init).mockRejectedValueOnce(
			new Error("Discord client error"),
		);

		await start();

		expect(logger.error).toHaveBeenCalledTimes(1);
		expect(logger.error).toHaveBeenCalledWith(
			"Error initialising bot: Error: Discord client error",
		);
		expect(process.exit).toHaveBeenCalledTimes(1);
		expect(process.exit).toHaveBeenCalledWith(1);
	});
});
