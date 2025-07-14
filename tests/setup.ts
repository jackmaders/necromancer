// Import heavy dependencies
import { beforeEach, expect } from "vitest";
import "zod/v4";

beforeEach(() => {
	// biome-ignore lint/suspicious/noMisplacedAssertion: this will run after all tests
	expect.hasAssertions();
});
