import {
	type ChatInputCommandInteraction,
	MessageFlags,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} from "discord.js";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { logger } from "@/shared/model/logging/logger-client.ts";
import { InteractionBuilder } from "../../../testing/interaction-builder.ts";
import { createParentCommand } from "../command-factory.ts";

vi.mock("@/shared/model/logging/logger-client.ts");

describe("createParentCommand", () => {
	let subcommands = newSubcommands();

	beforeAll(() => {
		vi.spyOn(SlashCommandBuilder.prototype, "setName");
		vi.spyOn(SlashCommandBuilder.prototype, "setDescription");
		vi.spyOn(SlashCommandBuilder.prototype, "addSubcommand");
	});

	beforeEach(() => {
		subcommands = newSubcommands();
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
		const overrides = {
			options: {
				getSubcommand: vi.fn().mockReturnValue("sub1"),
			},
		};

		const parent = createParentCommand("parent", "description", subcommands);

		const interaction = new InteractionBuilder("parent")
			.with(overrides as unknown as Partial<ChatInputCommandInteraction>)
			.build();

		await parent.execute(interaction);

		expect(subcommands[0].execute).toHaveBeenCalledTimes(1);
		expect(subcommands[0].execute).toHaveBeenCalledWith(interaction);
		expect(subcommands[1].execute).not.toHaveBeenCalled();
	});

	it("should log a warning and reply with an error if the subcommand is not found", async () => {
		const parentCommand = createParentCommand(
			"parent",
			"description",
			subcommands,
		);
		const nonExistentSubcommand = "non-existent-sub";
		const overrides = {
			options: {
				getSubcommand: vi.fn().mockReturnValue(nonExistentSubcommand),
			},
		};

		const interaction = new InteractionBuilder("parent")
			.with(overrides as unknown as Partial<ChatInputCommandInteraction>)
			.build();

		await parentCommand.execute(interaction);

		expect(subcommands[0].execute).not.toHaveBeenCalled();
		expect(subcommands[1].execute).not.toHaveBeenCalled();
		expect(logger.warn).toHaveBeenCalledWith(
			'No matching subcommand found for command "parent"',
			nonExistentSubcommand,
		);

		expect(interaction.reply).toHaveBeenCalledWith({
			content: "I couldn't find that subcommand. Please report this issue.",
			flags: [MessageFlags.Ephemeral],
		});
	});
});

function newSubcommands() {
	return [
		{
			data: new SlashCommandSubcommandBuilder().setName("sub1"),
			execute: vi.fn(),
		},
		{
			data: new SlashCommandSubcommandBuilder().setName("sub2"),
			execute: vi.fn(),
		},
	];
}
