import type { Command } from "../commands/command.ts";

export interface AppContext {
	commands: Map<string, Command>;
}

export type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>;
		}
	: T;
