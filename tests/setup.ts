import { beforeEach, expect } from "vitest";

// Import heavy dependencies
import "zod";

beforeEach(() => {
	// biome-ignore lint/suspicious/noMisplacedAssertion: this will run after all tests
	expect.hasAssertions();
});
