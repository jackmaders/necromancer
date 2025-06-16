import {  describe, expect, it } from "vitest";
import { greet } from "../index.ts";

describe("index", () => {
	it("should not throw an error", () => {
        const greeting = greet("World");
        expect(greeting).toBe("Hello, World!");
    });
});
