import type { Command } from "@/shared/model";
import { data } from "./model/data.ts";
import { execute } from "./model/execute.ts";

export const pingCommand: Command = {
	data,
	execute,
};
