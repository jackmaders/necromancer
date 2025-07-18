/** biome-ignore-all lint/style/useNamingConvention: Environment variables are CONSTANT_CASE */
import { z } from "zod";

export const envSchema = z.object({
	DISCORD_CLIENT_ID: z.string().min(1),
	DISCORD_TOKEN: z.string().min(1),
	NODE_ENV: z.string().default("production"),
	PINO_LOG_LEVEL: z
		.enum(["trace", "debug", "info", "warn", "error", "fatal"])
		.default("info"),
	PRISMA_DATABASE_URL: z.string().min(1),
});

type EnvSchema = z.infer<typeof envSchema>;

/**
 * Parses and validates environment variables using a Zod schema.
 * @param partial - Whether to accept a partial process.env object.
 */
function getEnvVar<T extends boolean = false>(
	partial: T = false as T,
): T extends true ? Partial<EnvSchema> : EnvSchema {
	try {
		if (partial) {
			/** biome-ignore lint/style/noProcessEnv: This file is responsible for env parsing */
			const partialEnv = envSchema.partial().parse(process.env);
			return partialEnv as T extends true ? Partial<EnvSchema> : EnvSchema;
		}

		/** biome-ignore lint/style/noProcessEnv: This file is responsible for env parsing */
		return envSchema.parse(process.env);
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error(z.prettifyError(error));
		}
		throw error;
	}
}

export { getEnvVar };
