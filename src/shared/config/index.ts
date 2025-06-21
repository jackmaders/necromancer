/** biome-ignore-all lint/style/useNamingConvention: environment variables are  CONSTANT_CASE */
/** biome-ignore-all lint/style/noProcessEnv: configuring environment variables */
import { z } from "zod";

const envSchema = z.object({
	DISCORD_TOKEN: z.string().min(1, "DISCORD_TOKEN cannot be empty."),
	PRISMA_DATABASE_URL: z
		.string()
		.min(1, "PRISMA_DATABASE_URL cannot be empty."),
});

export const env = envSchema.parse(process.env);
