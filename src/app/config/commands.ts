import { viewConfigSubcommand } from "@/features/admin/view";
import { postAvailabilitySubcommand } from "@/features/availability/post";
import { helpCommand } from "@/features/help";
import { PingCommand } from "@/features/ping";
import { createTeamSubcommand } from "@/features/team/create";
import { deleteTeamSubcommand } from "@/features/team/delete";
import { createParentCommand } from "@/shared/lib";

const availabilityCommand = createParentCommand(
	"availability",
	"Manage teams and their settings.",
	[postAvailabilitySubcommand],
);

const teamCommand = createParentCommand(
	"team",
	"Manage teams and their settings.",
	[createTeamSubcommand, deleteTeamSubcommand],
);

const configCommand = createParentCommand(
	"config",
	"View and manage bot configurations.",
	[viewConfigSubcommand],
);

export function getCommands() {
	return [
		new PingCommand(),
		availabilityCommand,
		helpCommand,
		teamCommand,
		configCommand,
	];
}
