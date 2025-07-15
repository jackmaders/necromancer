import { PrismaClientKnownRequestError } from "prisma/generated/prisma-client-js/runtime/library";
import { describe, expect, it } from "vitest";
import { parsePrismaError } from "../prisma-errors.ts";

describe("Prisma Errors", () => {
	it("should handle a PrismaUniqueConstraintError", () => {
		const genericError = new PrismaClientKnownRequestError("A generic error", {
			clientVersion: "1",
			code: "P2002",
		});
		expect(parsePrismaError(genericError)?.name).toBe(
			"PrismaUniqueConstraintError",
		);
	});

	it("should handle a PrismaOperationFailedError", () => {
		const genericError = new PrismaClientKnownRequestError("A generic error", {
			clientVersion: "1",
			code: "P2025",
		});
		expect(parsePrismaError(genericError)?.name).toBe(
			"PrismaOperationFailedError",
		);
	});

	it("should return null for non-PrismaClientKnownRequestError errors", () => {
		const genericError = new Error("A generic error");
		expect(parsePrismaError(genericError)).toBeNull();
	});

	it("should handle unknown Prisma error codes", () => {
		const unknownPrismaError = new PrismaClientKnownRequestError("", {
			clientVersion: "1",
			code: "P9999", // An unknown code
		});
		expect(parsePrismaError(unknownPrismaError)?.name).toBe("unknown");
	});
});
