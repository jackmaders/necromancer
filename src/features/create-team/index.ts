import type { Subcommand } from "@/shared/model";
import { data } from "./model/data.ts";
import { execute } from "./model/execute.ts";

export const createTeamSubcommand: Subcommand = {
	data,
	execute,
};
