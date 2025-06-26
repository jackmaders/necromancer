/** biome-ignore-all lint/suspicious/noConsole: bespoke script doesn't need a logging util */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { commands } from "@/app/config/commands.ts";
import { getEnvVar } from "@/shared/config/env.ts";
import { logger } from "@/shared/model";

describe("Command Deployment Script", () => {
	beforeEach(() => {
		vi.spyOn(process, "exit").mockImplementation(() => ({}) as never);

		vi.resetModules();
	});

	it("should deploy the registered commands", async () => {
		await import("../deploy-commands.ts");
		const { REST, Routes } = await import("discord.js");

		expect(new REST().setToken).toHaveBeenCalledWith(getEnvVar().DISCORD_TOKEN);

		expect(new REST().put).toHaveBeenCalledWith(
			Routes.applicationCommands("DISCORD_CLIENT_ID"),
			{ body: commands.map((command) => command.data.toJSON()) },
		);
	});

	it("should exit if DISCORD_TOKEN is missing", async () => {
		vi.stubEnv("DISCORD_TOKEN", undefined);

		await import("../deploy-commands.ts");

		expect(logger.error).toHaveBeenCalledWith(
			"Failed to deploy commands:",
			new Error("Missing Environment Variable: DISCORD_TOKEN"),
		);
		expect(process.exit).toHaveBeenCalledWith(1);
	});

	it("should exit if DISCORD_CLIENT_ID is missing", async () => {
		vi.stubEnv("DISCORD_CLIENT_ID", undefined);

		await import("../deploy-commands.ts");

		expect(logger.error).toHaveBeenCalledWith(
			"Failed to deploy commands:",
			new Error("Missing Environment Variable: DISCORD_CLIENT_ID"),
		);
		expect(process.exit).toHaveBeenCalledWith(1);
	});

	it("should handle an unexpected error", async () => {
		const error = new Error("Unexpected Error");
		const { REST } = await import("discord.js");
		vi.mocked(new REST().setToken).mockImplementation(() => {
			throw error;
		});

		await import("../deploy-commands.ts");

		expect(logger.error).toHaveBeenCalledWith(
			"Failed to deploy commands:",
			error,
		);
		expect(process.exit).toHaveBeenCalledWith(1);
	});
});

vi.mock("@/shared/model/logging/logger-client.ts");
vi.mock("discord.js");
