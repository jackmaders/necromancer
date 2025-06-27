import { describe, expect, it } from "vitest";
import { getObjectProperty } from "../get-object-property.ts";

describe("getObjectProperty", () => {
	it("should return null if 'object' is not provided", () => {
		const response = getObjectProperty(null, "test");
		expect(response).toBeNull();
	});

	it("should return null if 'object' is not an object", () => {
		const response = getObjectProperty("test", "test");
		expect(response).toBeNull();
	});

	it("should return null if 'object' does not have the property", () => {
		const response = getObjectProperty({ prop: 1 }, "test");
		expect(response).toBeNull();
	});

	it("should return the value if 'object' does have the property", () => {
		const response = getObjectProperty({ prop: 1 }, "prop");
		expect(response).toBe(1);
	});
});
