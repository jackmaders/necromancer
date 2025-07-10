import { createTeamSubcommand } from "@/features/create-team";
import { deleteTeamSubcommand } from "@/features/delete-team";
import { pingCommand } from "@/features/ping";
import { createParentCommand } from "@/shared/lib";

const teamCommand = createParentCommand(
	"team",
	"Manage teams and their settings.",
	[createTeamSubcommand, deleteTeamSubcommand],
);

export const commands = [pingCommand, teamCommand];
