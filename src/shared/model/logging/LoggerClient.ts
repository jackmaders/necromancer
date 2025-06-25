import { type Logger, type LoggerOptions, pino } from "pino";
import { getEnvVar } from "@/shared/config";

class LoggerClient {
	initialised = false;
	private logger: Logger = pino();
	// biome-ignore lint/suspicious/noConsole: use console fallback
	debug: Logger["debug"] = console.debug;
	// biome-ignore lint/suspicious/noConsole: use console fallback
	info: Logger["info"] = console.info;
	// biome-ignore lint/suspicious/noConsole: use console fallback
	warn: Logger["warn"] = console.warn;
	// biome-ignore lint/suspicious/noConsole: use console fallback
	error: Logger["error"] = console.error;

	init() {
		const { NODE_ENV, PINO_LOG_LEVEL } = getEnvVar();

		const IsProduction = NODE_ENV === "production";
		const IsDevelopmentTty = !IsProduction && process.stdout.isTTY;

		const DevOptions: Partial<LoggerOptions> = {
			transport: {
				options: {
					colorize: true,
					ignore: "pid,hostname",
					translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
				},
				target: "pino-pretty",
			},
		};

		const options: LoggerOptions = {
			level: PINO_LOG_LEVEL,
			timestamp: pino.stdTimeFunctions.isoTime,
			...(!IsProduction && IsDevelopmentTty ? DevOptions : {}),
		};

		this.logger = pino(options);

		this.debug = this.logger.debug.bind(this.logger);
		this.info = this.logger.info.bind(this.logger);
		this.error = this.logger.error.bind(this.logger);
		this.warn = this.logger.warn.bind(this.logger);

		this.initialised = true;
	}
}

export const logger = new LoggerClient();
