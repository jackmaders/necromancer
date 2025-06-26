import type { Subcommand } from "@/shared/model/types.js";
import { data } from "./model/data.ts";
import { execute } from "./model/execute.ts";

export const command: Subcommand = {
	data,
	execute,
};
