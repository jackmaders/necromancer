import type {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
} from "discord.js";
import type { Guild, Poll, Team } from "prisma/generated/prisma-client-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";

import { teamService } from "@/entities/team";
import { GuildOnlyError } from "@/shared/model";
import { postAvailabilitySubcommand } from "..";
import { availabilityService } from "../model/availability-service.ts";
import { editReplyWithAvailabilityPollEmbed } from "../ui/replies.ts";

vi.mock("@/entities/team");
vi.mock("../model/availability-service");
vi.mock("../ui/replies");

const poll = { id: "poll-id", weekStartDate: new Date() } as Poll;
const messageId = "message-id";

describe("Post Availability Poll Subcommand", () => {
	describe("execute", () => {
		let interaction: MockProxy<ChatInputCommandInteraction>;
		let team: MockProxy<Team>;
		let guild: MockProxy<Guild>;

		beforeEach(() => {
			team = mock<Team>();
			guild = mock<Guild>();
			interaction = mock<ChatInputCommandInteraction>();
			interaction.guildId = guild.guildId;
			interaction.options.getString = vi.fn().mockReturnValue(team.name);
		});

		it("should throw GuildOnlyError if not in a guild", async () => {
			interaction.guildId = null;

			await expect(
				postAvailabilitySubcommand.execute(interaction),
			).rejects.toThrow(GuildOnlyError);
		});

		it("should create a poll and post it", async () => {
			vi.mocked(availabilityService.createPoll).mockResolvedValue(poll);
			vi.mocked(interaction.fetchReply).mockResolvedValue({
				id: messageId,
			} as never);

			await postAvailabilitySubcommand.execute(interaction);

			expect(interaction.deferReply).toHaveBeenCalled();
			expect(availabilityService.createPoll).toHaveBeenCalledWith(
				guild.guildId,
				team.name,
			);
			expect(editReplyWithAvailabilityPollEmbed).toHaveBeenCalledWith(
				interaction,
				poll,
			);
			expect(interaction.fetchReply).toHaveBeenCalled();
			expect(availabilityService.setPollMessageId).toHaveBeenCalledWith(
				poll.id,
				messageId,
			);
		});
	});

	describe("autocomplete", () => {
		let interaction: MockProxy<AutocompleteInteraction>;

		let guild: MockProxy<Guild>;

		beforeEach(() => {
			guild = mock<Guild>();
			interaction = mock<AutocompleteInteraction>();
			interaction.guildId = guild.guildId;
			interaction.options.getFocused = vi.fn().mockReturnValue("team");
		});

		it("should throw GuildOnlyError if not in a guild", async () => {
			interaction.guildId = null;

			expect(postAvailabilitySubcommand.autocomplete).toBeDefined();

			await expect(() =>
				postAvailabilitySubcommand.autocomplete?.(interaction as never),
			).rejects.toThrow(GuildOnlyError);
		});

		it("should return filtered team names", async () => {
			const teams = [
				{ name: "Team A" },
				{ name: "Team B" },
				{ name: "Another Team" },
			];
			vi.mocked(teamService.getTeamsByGuildId).mockResolvedValue(
				teams as never,
			);

			await postAvailabilitySubcommand.autocomplete?.(interaction);

			expect(teamService.getTeamsByGuildId).toHaveBeenCalledWith(guild.guildId);
			expect(interaction.respond).toHaveBeenCalledWith([
				{ name: "team a", value: "team a" },
				{ name: "team b", value: "team b" },
			]);
		});

		it("should limit results to 25", async () => {
			const teams = Array.from({ length: 30 }, (_, i) => ({
				name: `team ${i}`,
			}));
			vi.mocked(teamService.getTeamsByGuildId).mockResolvedValue(
				teams as never,
			);

			await postAvailabilitySubcommand.autocomplete?.(interaction as never);

			const respondedOptions = vi.mocked(interaction.respond).mock.calls[0][0];
			expect(respondedOptions.length).toBe(25);
		});
	});
});
