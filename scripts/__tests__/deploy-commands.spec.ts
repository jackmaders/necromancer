/** biome-ignore-all lint/suspicious/noConsole: bespoke script doesn't need a logging util */

import { REST, Routes } from "discord.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { commands } from "@/app/config/commands.ts";
import { getEnvVar } from "@/shared/config/env.ts";
import { logger } from "@/shared/model/index.ts";
import { deployCommands } from "../deploy-commands.ts";

vi.mock("@/shared/model/logging/logger-client.ts");
vi.mock("discord.js");

describe("Command Deployment Script", () => {
	beforeEach(() => {
		vi.spyOn(process, "exit").mockImplementation(() => ({}) as never);
	});

	it("should deploy the registered commands", async () => {
		await deployCommands();

		expect(new REST().setToken).toHaveBeenCalledWith(getEnvVar().DISCORD_TOKEN);

		expect(new REST().put).toHaveBeenCalledWith(
			Routes.applicationCommands("DISCORD_CLIENT_ID"),
			{ body: commands.map((command) => command.data.toJSON()) },
		);
	});

	it("should exit if DISCORD_TOKEN is missing", async () => {
		vi.stubEnv("DISCORD_TOKEN", undefined);

		await deployCommands();

		expect(logger.error).toHaveBeenCalledWith(
			"Failed to deploy commands: Error: Missing Environment Variable: DISCORD_TOKEN",
		);
		expect(process.exit).toHaveBeenCalledWith(1);
	});

	it("should exit if DISCORD_CLIENT_ID is missing", async () => {
		vi.stubEnv("DISCORD_CLIENT_ID", undefined);

		await deployCommands();

		expect(logger.error).toHaveBeenCalledWith(
			"Failed to deploy commands: Error: Missing Environment Variable: DISCORD_CLIENT_ID",
		);
		expect(process.exit).toHaveBeenCalledWith(1);
	});

	it("should handle an unexpected error", async () => {
		const error = new Error("Unexpected Error");

		vi.mocked(new REST().setToken).mockImplementation(() => {
			throw error;
		});

		await deployCommands();

		expect(logger.error).toHaveBeenCalledWith(
			"Failed to deploy commands: Error: Unexpected Error",
		);
		expect(process.exit).toHaveBeenCalledWith(1);
	});

	it("should execute the function on import for non-test environments", async () => {
		vi.stubEnv("NODE_ENV", "production");
		vi.resetModules();

		const { REST } = await import("discord.js");
		await import("../deploy-commands.ts");

		expect(new REST().setToken).toHaveBeenCalledWith(getEnvVar().DISCORD_TOKEN);
		expect(new REST().put).toHaveBeenCalledWith(
			Routes.applicationCommands("DISCORD_CLIENT_ID"),
			{ body: commands.map((command) => command.data.toJSON()) },
		);
	});
});
