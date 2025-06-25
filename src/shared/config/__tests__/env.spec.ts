import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Environment Variables Config", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it("should parse valid environment variables", async () => {
		expect.assertions(2);

		const { getEnvVar } = await import("../env.ts");
		expect(getEnvVar().DISCORD_TOKEN).toBe("your_discord_token");
		expect(getEnvVar().PRISMA_DATABASE_URL).toBe("file:./dev.db");
	});

	it("should exit if DISCORD_TOKEN is missing", async () => {
		expect.assertions(1);

		vi.stubEnv("DISCORD_TOKEN", undefined);

		const { getEnvVar } = await import("../env.ts");

		expect(getEnvVar).toThrow(
			"✖ Invalid input: expected string, received undefined\n  → at DISCORD_TOKEN",
		);
	});

	it("should exit if PRISMA_DATABASE_URL is missing", async () => {
		expect.assertions(1);

		vi.stubEnv("PRISMA_DATABASE_URL", undefined);

		const { getEnvVar } = await import("../env.ts");

		expect(getEnvVar).toThrow(
			"✖ Invalid input: expected string, received undefined\n  → at PRISMA_DATABASE_URL",
		);
	});

	it("should exit if an unknown error is thrown", async () => {
		expect.assertions(1);

		const error = new Error("Unknown error");

		const { getEnvVar, envSchema } = await import("../env.ts");

		vi.spyOn(envSchema, "parse").mockImplementation(() => {
			throw error;
		});

		expect(getEnvVar).toThrow(error);
	});

	it("should handle a partial set of environment variables", async () => {
		expect.assertions(2);
		vi.stubEnv("PRISMA_DATABASE_URL", undefined);

		const { getEnvVar } = await import("../env.ts");
		expect(getEnvVar(true).DISCORD_TOKEN).toBe("your_discord_token");
		expect(getEnvVar(true).PRISMA_DATABASE_URL).toBeUndefined();
	});
});
