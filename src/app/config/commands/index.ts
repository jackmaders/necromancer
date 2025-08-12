import { AdminViewSubcommand } from "@/features/admin-view/index.ts";
import { AvailabilityPostSubcommand } from "@/features/availability-post";
import { HelpCommand } from "@/features/help";
import { PingCommand } from "@/features/ping";
import { TeamCreateSubcommand } from "@/features/team-create";
import { TeamDeleteSubcommand } from "@/features/team-delete";
import { type Command, ParentCommand } from "@/shared/lib";

const teamCommand = new ParentCommand(
	"team",
	"Manage teams and their settings.",
	[new TeamCreateSubcommand(), new TeamDeleteSubcommand()],
);

const adminCommand = new ParentCommand(
	"admin",
	"Admin commands for managing the bot.",
	[new AdminViewSubcommand()],
);

const availabilityCommand = new ParentCommand(
	"availability",
	"Manage your availability status.",
	[new AvailabilityPostSubcommand()],
);

export function getCommands(): Command[] {
	return [
		teamCommand,
		adminCommand,
		availabilityCommand,
		new HelpCommand(),
		new PingCommand(),
	];
}
