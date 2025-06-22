import { describe, expect, it, vi } from "vitest";
import { start } from "@/app/index.ts";

describe("Application Entrypoint", () => {
	it("should start the bot", async () => {
		expect.assertions(1);
		await import("../index.ts");

		expect(start).toHaveBeenCalledTimes(1);
	});
});

vi.mock("../app/index.ts");
