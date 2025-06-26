import { createTeamSubcommand } from "@/features/create-team";
import { pingCommand } from "@/features/ping";
import { createParentCommand } from "@/shared/lib";
import type { Command } from "@/shared/model";

const teamCommand = createParentCommand(
	"team",
	"Manage teams and their settings.",
	[createTeamSubcommand],
);

export const commands: Command[] = [pingCommand, teamCommand];
