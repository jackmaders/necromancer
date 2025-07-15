import { PrismaClientKnownRequestError } from "prisma/generated/prisma-client-js/runtime/library";

const prismaErrorNames = new Map([
	["P2002", "PrismaUniqueConstraintError"],
	["P2025", "PrismaOperationFailedError"],
]);

export function parsePrismaError(error: unknown): PrismaError | null {
	if (!(error instanceof PrismaClientKnownRequestError)) {
		return null;
	}

	return new PrismaError(error);
}

class PrismaError extends PrismaClientKnownRequestError {
	name: string;

	constructor(error: PrismaClientKnownRequestError) {
		super(error.message, {
			batchRequestIdx: error.batchRequestIdx,
			clientVersion: error.clientVersion,
			code: error.code,
			meta: error.meta,
		});

		this.name = prismaErrorNames.get(error.code) ?? "unknown";
	}
}
