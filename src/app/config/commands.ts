import { createTeamSubcommand } from "@/features/create-team";
import { pingCommand } from "@/features/ping";
import { createParentCommand } from "@/shared/lib";

const teamCommand = createParentCommand(
	"team",
	"Manage teams and their settings.",
	[createTeamSubcommand],
);

export const commands = [pingCommand, teamCommand];
