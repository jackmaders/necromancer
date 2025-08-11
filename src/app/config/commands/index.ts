import { TeamCreateSubcommand } from "@/features/team-create";
import { TeamDeleteSubcommand } from "@/features/team-delete";
import { ParentCommand } from "@/shared/lib";

const teamCommand = new ParentCommand(
	"team",
	"Manage teams and their settings.",
	[new TeamCreateSubcommand(), new TeamDeleteSubcommand()],
);

export function getCommands() {
	return [teamCommand];
}
