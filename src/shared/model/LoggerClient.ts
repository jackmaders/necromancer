import { type Logger, type LoggerOptions, pino } from "pino";
import { getEnvVar } from "../config/index.ts";

const { NODE_ENV, PINO_LOG_LEVEL } = getEnvVar();

const IS_PRODUCTION = NODE_ENV === "production";
const IS_DEVELOPMENT_TTY = !IS_PRODUCTION && process.stdout.isTTY;

const DEV_OPTIONS: Partial<LoggerOptions> = {
	transport: {
		options: {
			colorize: true,
			ignore: "pid,hostname",
			translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
		},
		target: "pino-pretty",
	},
};

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
		const options: LoggerOptions = {
			level: PINO_LOG_LEVEL,
			timestamp: pino.stdTimeFunctions.isoTime,
			...(!IS_PRODUCTION && IS_DEVELOPMENT_TTY ? DEV_OPTIONS : {}),
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
