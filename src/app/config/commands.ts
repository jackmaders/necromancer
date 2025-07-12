import { createTeamSubcommand } from "@/features/create-team";
import { deleteTeamSubcommand } from "@/features/delete-team";
import { pingCommand } from "@/features/ping";
import { postAvailabilitySubcommand } from "@/features/post-availability-poll";
import { viewConfigSubcommand } from "@/features/view-config";
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

export const commands = [
	pingCommand,
	teamCommand,
	configCommand,
	availabilityCommand,
];
