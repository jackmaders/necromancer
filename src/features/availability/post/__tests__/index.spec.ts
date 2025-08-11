import type { ChatInputCommandInteraction, PollData } from "discord.js";
import type { Guild } from "prisma/generated/prisma-client-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";
import { mockPollData } from "@/fixtures/discord.ts";
import { mockGuild } from "@/fixtures/prisma.ts";
import { type AppContext, GuildOnlyError } from "@/shared/model";
import { postAvailabilitySubcommand } from "../index.ts";
import { buildAvailabilityPoll } from "../ui/availability-poll.ts";

vi.mock("@/entities/team");
vi.mock("../model/availability-service");
vi.mock("../ui/availability-poll");

describe("Post Availability Poll Subcommand", () => {
	let interaction: MockProxy<ChatInputCommandInteraction>;
	let context: MockProxy<AppContext>;
	let guild: MockProxy<Guild>;
	let poll: MockProxy<PollData>;

	beforeEach(() => {
		guild = mock<Guild>(mockGuild);
		poll = mock<PollData>(mockPollData);
		interaction = mock<ChatInputCommandInteraction>();
		context = mock<AppContext>();
		interaction.guildId = guild.guildId;
	});

	it("should throw GuildOnlyError if not in a guild", async () => {
		interaction.guildId = null;

		await expect(
			postAvailabilitySubcommand.execute(interaction, context),
		).rejects.toThrow(GuildOnlyError);
	});

	it("should create a poll and post it", async () => {
		vi.mocked(buildAvailabilityPoll).mockReturnValue(poll);

		await postAvailabilitySubcommand.execute(interaction, context);

		expect(interaction.reply).toHaveBeenCalledWith({ poll });
	});
});
