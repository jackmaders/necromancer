import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("Environment Variables Config", () => {
	beforeEach(() => {
		vi.stubEnv("DISCORD_CLIENT_ID", "valid_client_id");
		vi.stubEnv("DISCORD_TOKEN", "valid_token");
		vi.stubEnv("PRISMA_DATABASE_URL", "valid_url");

		vi.clearAllMocks();
		vi.resetModules();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllEnvs();
	});

	it("should parse valid environment variables", async () => {
		expect.assertions(2);

		const { env } = await import("../env.ts");
		expect(env().DISCORD_TOKEN).toBe("valid_token");
		expect(env().PRISMA_DATABASE_URL).toBe("valid_url");
	});

	it("should exit if DISCORD_TOKEN is missing", async () => {
		expect.assertions(1);

		vi.stubEnv("DISCORD_TOKEN", undefined);

		const { env } = await import("../env.ts");

		expect(env).toThrow(
			"✖ Invalid input: expected string, received undefined\n  → at DISCORD_TOKEN",
		);
	});

	it("should exit if PRISMA_DATABASE_URL is missing", async () => {
		expect.assertions(1);

		vi.stubEnv("PRISMA_DATABASE_URL", undefined);

		const { env } = await import("../env.ts");

		expect(env).toThrow(
			"✖ Invalid input: expected string, received undefined\n  → at PRISMA_DATABASE_URL",
		);
	});

	it("should exit if an unknown error is thrown", async () => {
		expect.assertions(1);

		const error = new Error("Unknown error");

		const { env, envSchema } = await import("../env.ts");

		vi.spyOn(envSchema, "parse").mockImplementation(() => {
			throw error;
		});

		expect(env).toThrow(error);
	});
});
