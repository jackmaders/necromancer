/** biome-ignore-all lint/style/useNamingConvention: Environment variables are CONSTANT_CASE */
import { z } from "zod/v4";

const envSchema = z.object({
	DISCORD_TOKEN: z.string().min(1),
	PRISMA_DATABASE_URL: z.string().min(1),
});

let _env: z.infer<typeof envSchema> | undefined;

/**
 * Parses and validates environment variables using Zod schema.
 */
function env() {
	try {
		if (!_env) {
			/** biome-ignore lint/style/noProcessEnv: This file is responsible for env parsing */
			_env = envSchema.parse(process.env);
		}

		return _env;
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error(z.prettifyError(error));
		}

		throw error;
	}
}

export { env, envSchema };
