import { CreateTeamSubcommand } from "@/features/team-create";
import { DeleteTeamSubcommand } from "@/features/team-delete";
import { ParentCommand } from "@/shared/model";

// Instantiate and export the fully composed parent command
export const teamCommand = new ParentCommand(
	"team",
	"Manage teams and their settings.",
	[new CreateTeamSubcommand(), new DeleteTeamSubcommand()],
);
