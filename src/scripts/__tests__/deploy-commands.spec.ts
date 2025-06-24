/** biome-ignore-all lint/suspicious/noConsole: bespoke script doesn't need a logging util */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { commands } from "@/app/config/commands.ts";
import { env } from "@/shared/config/env.ts";

describe("Command Deployment Script", () => {
	beforeEach(() => {
		vi.spyOn(process, "exit").mockImplementation(() => ({}) as never);
		vi.spyOn(console, "log").mockImplementation(() => ({}));
		vi.spyOn(console, "error").mockImplementation(() => ({}));
		vi.stubEnv("DISCORD_CLIENT_ID", "valid_client_id");
		vi.stubEnv("DISCORD_TOKEN", "valid_token");
		vi.stubEnv("PRISMA_DATABASE_URL", "valid_url");

		vi.clearAllMocks();
		vi.resetModules();
	});

	it("should deploy the registered commands", async () => {
		await import("../deploy-commands.ts");
		const { REST, Routes } = await import("discord.js");

		expect(new REST().setToken).toHaveBeenCalledWith(env().DISCORD_TOKEN);

		expect(new REST().put).toHaveBeenCalledWith(
			Routes.applicationCommands("DISCORD_CLIENT_ID"),
			{ body: commands.map((command) => command.data.toJSON()) },
		);
	});

	it("should handle an unexpected error", async () => {
		const error = new Error("Unexpected Error");
		const { REST } = await import("discord.js");
		vi.mocked(new REST().setToken).mockImplementation(() => {
			throw error;
		});

		await import("../deploy-commands.ts");

		expect(console.error).toHaveBeenCalledWith(
			"Failed to deploy commands:",
			error,
		);
		expect(process.exit).toHaveBeenCalledWith(1);
	});
});

vi.mock("discord.js");
