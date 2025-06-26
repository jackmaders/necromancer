import type { Command } from "@/shared/model";
import { pingCommand } from "./ping-command.ts";
import { teamCommand } from "./team-command.ts";

export const commands: Command[] = [pingCommand, teamCommand];
