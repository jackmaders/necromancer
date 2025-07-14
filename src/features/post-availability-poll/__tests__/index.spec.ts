import type { ChatInputCommandInteraction, PollData } from "discord.js";
import type { Guild } from "prisma/generated/prisma-client-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";
import { GuildOnlyError } from "@/shared/model";
import { postAvailabilitySubcommand } from "..";
import { buildAvailabilityPoll } from "../ui/availability-poll.ts";

vi.mock("@/entities/team");
vi.mock("../model/availability-service");
vi.mock("../ui/availability-poll");

describe("Post Availability Poll Subcommand", () => {
	let interaction: MockProxy<ChatInputCommandInteraction>;
	let guild: MockProxy<Guild>;
	let poll: MockProxy<PollData>;

	beforeEach(() => {
		guild = mock<Guild>();
		poll = mock<PollData>();

		interaction = mock<ChatInputCommandInteraction>();
		interaction.guildId = guild.guildId;
	});

	it("should throw GuildOnlyError if not in a guild", async () => {
		interaction.guildId = null;

		await expect(
			postAvailabilitySubcommand.execute(interaction),
		).rejects.toThrow(GuildOnlyError);
	});

	it("should create a poll and post it", async () => {
		vi.mocked(buildAvailabilityPoll).mockReturnValue(poll);

		await postAvailabilitySubcommand.execute(interaction);

		expect(interaction.reply).toHaveBeenCalledWith({ poll });
	});
});
