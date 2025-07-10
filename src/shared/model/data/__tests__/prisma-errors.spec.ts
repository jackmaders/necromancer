import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { describe, expect, it } from "vitest";
import { errorCodeToClass, parsePrismaError } from "../prisma-errors.ts";

describe("Prisma Errors", () => {
	it.each(Object.entries(errorCodeToClass))(
		"should handle a %s error",
		(code, ExpectedErrorClass) => {
			const error = new PrismaClientKnownRequestError("", {
				clientVersion: "1",
				code,
			});

			const parsedError = parsePrismaError(error);
			expect(parsedError).toBeInstanceOf(ExpectedErrorClass);
			expect(parsedError?.code).toBe(code);
		},
	);

	it("should return null for non-PrismaClientKnownRequestError errors", () => {
		const genericError = new Error("A generic error");
		expect(parsePrismaError(genericError)).toBeNull();
	});

	it("should return null for unknown Prisma error codes", () => {
		const unknownPrismaError = new PrismaClientKnownRequestError("", {
			clientVersion: "1",
			code: "P9999", // An unknown code
		});
		expect(parsePrismaError(unknownPrismaError)).toBeNull();
	});
});
