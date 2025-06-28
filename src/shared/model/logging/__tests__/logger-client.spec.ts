import { pino } from "pino";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoggerClient } from "../logger-client.ts";

describe("Logger Client", () => {
	beforeEach(() => {
		vi.spyOn(console, "debug").mockImplementation(() => ({}));
		vi.spyOn(console, "info").mockImplementation(() => ({}));
		vi.spyOn(console, "warn").mockImplementation(() => ({}));
		vi.spyOn(console, "error").mockImplementation(() => ({}));
	});

	it("should create an instance of the logger", () => {
		const logger = new LoggerClient().init();

		expect(pino).toBeCalledWith({
			level: "info",
			timestamp: expect.any(Function),
		});

		logger.debug("debug");
		logger.info("info");
		logger.warn("warn");
		logger.error("error");

		expect(pino().debug).toHaveBeenCalledTimes(1);
		expect(pino().debug).toHaveBeenCalledWith("debug");

		expect(pino().info).toHaveBeenCalledTimes(1);
		expect(pino().info).toHaveBeenCalledWith("info");

		expect(pino().warn).toHaveBeenCalledTimes(1);
		expect(pino().warn).toHaveBeenCalledWith("warn");

		expect(pino().error).toHaveBeenCalledTimes(1);
		expect(pino().error).toHaveBeenCalledWith("error");
	});

	it("should create an instance of the logger with dev settings", () => {
		vi.stubGlobal("process", {
			...process,
			stdout: {
				...process.stdout,
				// biome-ignore lint/style/useNamingConvention: Mirror existing Process
				isTTY: true,
			},
		});

		new LoggerClient().init();

		expect(pino).toBeCalledWith({
			level: "info",
			timestamp: expect.any(Function),
			transport: {
				options: {
					colorize: true,
					ignore: "pid,hostname",
					translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
				},
				target: "pino-pretty",
			},
		});
	});

	it("should use console.log before initialising the client", () => {
		const logger = new LoggerClient();

		logger.debug("debug");
		logger.info("info");
		logger.warn("warn");
		logger.error("error");

		// biome-ignore-start lint/suspicious/noConsole: console logging default
		expect(console.debug).toHaveBeenCalledTimes(1);
		expect(console.debug).toHaveBeenCalledWith("debug");

		expect(console.info).toHaveBeenCalledTimes(1);
		expect(console.info).toHaveBeenCalledWith("info");

		expect(console.warn).toHaveBeenCalledTimes(1);
		expect(console.warn).toHaveBeenCalledWith("warn");

		expect(console.error).toHaveBeenCalledTimes(1);
		expect(console.error).toHaveBeenCalledWith("error");
		// biome-ignore-end lint/suspicious/noConsole: console logging default
	});
});

vi.mock("pino");
