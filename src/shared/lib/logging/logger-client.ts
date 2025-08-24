import { type Logger, type LoggerOptions, pino, stdTimeFunctions } from "pino";
import { getEnvVar } from "@/shared/config";

export class LoggerClient {
	initialised = false;
	private logger: Logger = pino();
	// biome-ignore-start lint/suspicious/noConsole: console logging default
	debug: Logger["debug"] = console.debug;
	info: Logger["info"] = console.info;
	warn: Logger["warn"] = console.warn;
	error: Logger["error"] = console.error;
	// biome-ignore-end lint/suspicious/noConsole: console logging default

	init() {
		const { NODE_ENV, PINO_LOG_LEVEL } = getEnvVar();

		const isProduction = NODE_ENV === "production";
		const isDevelopmentTty = !isProduction && process.stdout.isTTY;

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
			timestamp: stdTimeFunctions.isoTime,
			...(isDevelopmentTty ? DevOptions : {}),
		};

		this.logger = pino(options);

		this.debug = this.logger.debug.bind(this.logger);
		this.info = this.logger.info.bind(this.logger);
		this.error = this.logger.error.bind(this.logger);
		this.warn = this.logger.warn.bind(this.logger);

		this.initialised = true;
		return this;
	}
}

export const logger = new LoggerClient();
