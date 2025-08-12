import { describe, expect, it, vi } from "vitest";
import { start } from "../model/index.ts";

vi.mock("../model/index.ts");
vi.mock("@/shared/model/logging/logger-client.ts");

describe("Application Entrypoint", () => {
	it("should start the bot", async () => {
		expect.assertions(1);
		await import("../index.ts");

		expect(start).toHaveBeenCalledTimes(1);
	});
});
