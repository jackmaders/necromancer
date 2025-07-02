import { PrismaClient } from "prisma/generated/prisma-client-js";
import { getEnvVar } from "@/shared/config";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices
declare global {
	var prismaClient: PrismaClient | undefined;
}

const { NODE_ENV } = getEnvVar();

const prisma = global.prismaClient ?? new PrismaClient({});

if (NODE_ENV !== "production") {
	global.prismaClient = prismaClient;
}

export { prisma };
