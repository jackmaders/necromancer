import {
	type AutocompleteInteraction,
	type ChatInputCommandInteraction,
	MessageFlags,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} from "discord.js";
import type { Guild } from "prisma/generated/prisma-client-js";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";
import { logger } from "@/shared/model/logging/logger-client.ts";
import type { AppContext, Subcommand } from "@/shared/model/types/index.js";
import { createParentCommand } from "../create-parent-command.ts";

vi.mock("@/shared/model/logging/logger-client.ts");

describe("createParentCommand", () => {
	let context: MockProxy<AppContext>;
	let chatInputCommandInteraction: MockProxy<ChatInputCommandInteraction>;
	let autocompleteInteraction: MockProxy<AutocompleteInteraction>;
	let subcommands: Subcommand[];

	let guild: MockProxy<Guild>;

	beforeAll(() => {
		vi.spyOn(SlashCommandBuilder.prototype, "setName");
		vi.spyOn(SlashCommandBuilder.prototype, "setDescription");
		vi.spyOn(SlashCommandBuilder.prototype, "addSubcommand");
	});

	beforeEach(() => {
		subcommands = newSubcommands();
		guild = mock<Guild>();
		context = mock<AppContext>();
		chatInputCommandInteraction = mock<ChatInputCommandInteraction>();
		autocompleteInteraction = mock<AutocompleteInteraction>();
		chatInputCommandInteraction.options.getSubcommand = vi
			.fn()
			.mockReturnValue("sub1");
	});

	it("should return a Command object with data and execute properties", () => {
		const command = createParentCommand("parent", "A parent command", []);
		expect(command).toHaveProperty("data");
		expect(command).toHaveProperty("execute");
		expect(typeof command.execute).toBe("function");
	});

	it("should correctly configure the parent command with name and description", () => {
		createParentCommand("parent-name", "parent-description", []);
		const builder = new SlashCommandBuilder();
		expect(builder.setName).toHaveBeenCalledWith("parent-name");
		expect(builder.setDescription).toHaveBeenCalledWith("parent-description");
	});

	it("should add all subcommands to the SlashCommandBuilder", () => {
		const subcommands = [
			{
				data: new SlashCommandSubcommandBuilder(),
				execute: vi.fn(),
			},
			{
				data: new SlashCommandSubcommandBuilder(),
				execute: vi.fn(),
			},
		];

		createParentCommand("parent", "description", subcommands);
		const builder = new SlashCommandBuilder();
		expect(builder.addSubcommand).toHaveBeenCalledTimes(2);
		expect(builder.addSubcommand).toHaveBeenCalledWith(subcommands[0].data);
		expect(builder.addSubcommand).toHaveBeenCalledWith(subcommands[1].data);
	});

	it("should execute the correct subcommand based on interaction options", async () => {
		const parent = createParentCommand("parent", "description", subcommands);

		await parent.execute(chatInputCommandInteraction, context);

		expect(subcommands[0].execute).toHaveBeenCalledTimes(1);
		expect(subcommands[0].execute).toHaveBeenCalledWith(
			chatInputCommandInteraction,
			context,
		);
		expect(subcommands[1].execute).not.toHaveBeenCalled();
	});

	it("should execute the correct autocomplete based on interaction options", async () => {
		autocompleteInteraction.commandName = "parent";
		autocompleteInteraction.guildId = guild.guildId;
		autocompleteInteraction.options.getSubcommand = vi
			.fn()
			.mockReturnValue("sub1");

		const parent = createParentCommand("parent", "description", subcommands);

		if (parent.autocomplete) {
			await parent.autocomplete(autocompleteInteraction, context);
		}

		expect(subcommands[0].autocomplete).toHaveBeenCalledTimes(1);
		expect(subcommands[0].autocomplete).toHaveBeenCalledWith(
			autocompleteInteraction,
			context,
		);
		expect(subcommands[1].autocomplete).not.toHaveBeenCalled();
	});

	it("should log a warning and reply with an error if the subcommand is not found when executing", async () => {
		chatInputCommandInteraction.options.getSubcommand = vi
			.fn()
			.mockReturnValue("non-existent-sub");
		const parentCommand = createParentCommand(
			"parent",
			"description",
			subcommands,
		);
		const nonExistentSubcommand = "non-existent-sub";

		await parentCommand.execute(chatInputCommandInteraction, context);

		expect(subcommands[0].execute).not.toHaveBeenCalled();
		expect(subcommands[1].execute).not.toHaveBeenCalled();
		expect(logger.warn).toHaveBeenCalledWith(
			'No matching subcommand found for command "parent"',
			nonExistentSubcommand,
		);

		expect(chatInputCommandInteraction.reply).toHaveBeenCalledWith({
			content: "I couldn't find that subcommand. Please report this issue.",
			flags: [MessageFlags.Ephemeral],
		});
	});
});

function newSubcommands() {
	return [
		{
			autocomplete: vi.fn(),
			data: new SlashCommandSubcommandBuilder().setName("sub1"),
			execute: vi.fn(),
		},
		{
			autocomplete: vi.fn(),
			data: new SlashCommandSubcommandBuilder().setName("sub2"),
			execute: vi.fn(),
		},
	];
}
