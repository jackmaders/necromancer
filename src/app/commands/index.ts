import { viewConfigSubcommand } from "@/features/admin-view";
import { postAvailabilitySubcommand } from "@/features/availability-post";

import { PingCommand } from "@/features/ping";
import { createParentCommand } from "@/shared/lib";

const availabilityCommand = createParentCommand(
	"availability",
	"Manage teams and their settings.",
	[postAvailabilitySubcommand],
);

const configCommand = createParentCommand(
	"config",
	"View and manage bot configurations.",
	[viewConfigSubcommand],
);

export function getCommands() {
	return [new PingCommand(), availabilityCommand, configCommand];
}
