import type {
	ChatInputCommandInteraction,
	InteractionCallback,
	InteractionResponse,
	PollData,
} from "discord.js";
import type { Guild, Team } from "prisma/generated/prisma-client-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";
import { availabilityService } from "@/entities/availability/index.ts";
import { teamService } from "@/entities/team/index.ts";
import { GuildOnlyError } from "@/shared/model";
import { buildAvailabilityPoll } from "../../ui/availability-poll.ts";
import { AvailabilityPostSubcommand } from "..";

vi.mock("../../ui/availability-poll.ts");
vi.mock("@/entities/team/index.ts");
vi.mock("@/entities/availability/index.ts");

describe("AvailabilityPostSubcommand", () => {
	describe("execute", () => {
		let command = new AvailabilityPostSubcommand();
		let interaction: MockProxy<ChatInputCommandInteraction>;
		let interactionCallback: MockProxy<InteractionCallback>;
		let team: MockProxy<Team>;
		let guild: MockProxy<Guild>;
		let poll: MockProxy<PollData>;

		beforeEach(() => {
			command = new AvailabilityPostSubcommand();
			team = mock<Team>();
			guild = mock<Guild>();
			poll = mock<PollData>();
			interaction = mock<ChatInputCommandInteraction>();
			interactionCallback = mock<InteractionCallback>();
			interaction.guildId = guild.id;
			interaction.options.getString = vi.fn().mockReturnValue(team.name);
		});

		it("should warn the user if the command is not used in a guild", async () => {
			expect.assertions(1);
			interaction.guildId = null;

			await expect(() => command.execute(interaction)).rejects.toThrow(
				GuildOnlyError,
			);
		});

		it("should create a poll and post it", async () => {
			vi.mocked(teamService.getTeamByName).mockResolvedValue(team);
			vi.mocked(buildAvailabilityPoll).mockReturnValue(poll);
			vi.mocked(interaction.reply).mockResolvedValue({
				interaction: interactionCallback,
				withResponse: true,
			} as unknown as InteractionResponse);

			await command.execute(interaction);

			expect(interaction.reply).toHaveBeenCalledWith({
				poll,
				withResponse: true,
			});

			expect(availabilityService.createPoll).toHaveBeenCalledWith(
				team.id,
				interactionCallback.responseMessageId,
				interaction.channelId,
			);
		});

		it("should fallback to interaction id", async () => {
			interactionCallback.responseMessageId = null;
			vi.mocked(teamService.getTeamByName).mockResolvedValue(team);
			vi.mocked(buildAvailabilityPoll).mockReturnValue(poll);
			vi.mocked(interaction.reply).mockResolvedValue({
				interaction: interactionCallback,
				withResponse: true,
			} as unknown as InteractionResponse);

			await command.execute(interaction);

			expect(interaction.reply).toHaveBeenCalledWith({
				poll,
				withResponse: true,
			});

			expect(availabilityService.createPoll).toHaveBeenCalledWith(
				team.id,
				interactionCallback.id,
				interaction.channelId,
			);
		});
	});
});
