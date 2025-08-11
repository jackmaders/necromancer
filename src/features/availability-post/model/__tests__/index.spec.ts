import type { ChatInputCommandInteraction, PollData } from "discord.js";
import type { Guild } from "prisma/generated/prisma-client-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";
import { mockPollData } from "@/fixtures/discord.ts";
import { mockGuild } from "@/fixtures/prisma.ts";
import { GuildOnlyError } from "@/shared/model";
import { buildAvailabilityPoll } from "../../ui/availability-poll.ts";
import { AvailabilityPostSubcommand } from "..";

vi.mock("@/entities/team");
vi.mock("../model/availability-service");
vi.mock("../../ui/availability-poll.ts");

describe("Post Availability Poll Subcommand", () => {
	let command = new AvailabilityPostSubcommand();
	let interaction: MockProxy<ChatInputCommandInteraction>;
	let guild: MockProxy<Guild>;
	let poll: MockProxy<PollData>;

	beforeEach(() => {
		command = new AvailabilityPostSubcommand();
		guild = mock<Guild>(mockGuild);
		poll = mock<PollData>(mockPollData);
		interaction = mock<ChatInputCommandInteraction>();
		interaction.guildId = guild.guildId;
	});

	it("should throw GuildOnlyError if not in a guild", async () => {
		interaction.guildId = null;

		await expect(command.execute(interaction)).rejects.toThrow(GuildOnlyError);
	});

	it("should create a poll and post it", async () => {
		vi.mocked(buildAvailabilityPoll).mockReturnValue(poll);

		await command.execute(interaction);

		expect(interaction.reply).toHaveBeenCalledWith({ poll });
	});
});
