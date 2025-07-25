import { createTeamSubcommand } from "@/features/create-team";
import { deleteTeamSubcommand } from "@/features/delete-team";
import { helpCommand } from "@/features/help";
import { pingCommand } from "@/features/ping";
import { postAvailabilitySubcommand } from "@/features/post-availability-poll";
import { viewConfigSubcommand } from "@/features/view-config";
import { getEnvVar } from "@/shared/config";
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

// Development-only commands that are not production ready.
const localCommands = [pingCommand, availabilityCommand];

export function getCommands() {
	const { NODE_ENV } = getEnvVar(true);

	return [
		...(NODE_ENV === "local" ? localCommands : []),
		helpCommand,
		teamCommand,
		configCommand,
	];
}
