import {
	type AutocompleteInteraction,
	type ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} from "discord.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";
import { logger } from "@/shared/lib/logging/logger-client.ts";
import { ParentCommand, Subcommand } from "../command.ts";

vi.mock("@/shared/lib/logging/logger-client.ts");

class TestSubcommand extends Subcommand {
	data = new SlashCommandSubcommandBuilder()
		.setName("sub")
		.setDescription("A test subcommand.");
	execute = vi.fn();
	autocomplete = vi.fn();
}

class TestSubcommandNoAutocomplete extends Subcommand {
	data = new SlashCommandSubcommandBuilder()
		.setName("sub-no-auto")
		.setDescription("A test subcommand.");
	execute = vi.fn();
}

describe("ParentCommand", () => {
	let parentCommand: ParentCommand;
	let testSubcommand: TestSubcommand;
	let testSubcommandNoAutocomplete: TestSubcommandNoAutocomplete;
	let chatInputCommandInteraction: MockProxy<ChatInputCommandInteraction>;
	let autocompleteInteraction: MockProxy<AutocompleteInteraction>;

	beforeEach(() => {
		testSubcommand = new TestSubcommand();
		testSubcommandNoAutocomplete = new TestSubcommandNoAutocomplete();
		parentCommand = new ParentCommand("parent", "A test parent command.", [
			testSubcommand,
			testSubcommandNoAutocomplete,
		]);
		chatInputCommandInteraction = mock<ChatInputCommandInteraction>();
		autocompleteInteraction = mock<AutocompleteInteraction>();

		chatInputCommandInteraction.options.getSubcommand = vi
			.fn()
			.mockReturnValue("sub");
		autocompleteInteraction.options.getSubcommand = vi
			.fn()
			.mockReturnValue("sub");
	});

	it("should build the command data correctly", () => {
		expect(parentCommand.data).toBeInstanceOf(SlashCommandBuilder);
		expect(parentCommand.data.name).toBe("parent");
		expect(parentCommand.data.description).toBe("A test parent command.");
		expect(parentCommand.subcommands.size).toBe(2);
		expect(parentCommand.data.options).toHaveLength(2);
	});

	describe("execute", () => {
		it("should route to the correct subcommand's execute method", async () => {
			await parentCommand.execute(chatInputCommandInteraction, {
				commands: new Map(),
			});
			expect(testSubcommand.execute).toHaveBeenCalledWith(
				chatInputCommandInteraction,
				{
					commands: new Map(),
				},
			);
		});

		it("should handle a missing subcommand gracefully", async () => {
			vi.mocked(
				chatInputCommandInteraction.options.getSubcommand,
			).mockReturnValue("nonexistent");
			await parentCommand.execute(chatInputCommandInteraction, {
				commands: new Map(),
			});
			expect(logger.error).toHaveBeenCalledWith(
				'Subcommand "nonexistent" not found for parent "parent".',
			);
			expect(chatInputCommandInteraction.reply).toHaveBeenCalledWith({
				content: "I couldn't find that subcommand. This may be a bug.",
				ephemeral: true,
			});
		});
	});

	describe("autocomplete", () => {
		it("should route to the correct subcommand's autocomplete method", async () => {
			vi.mocked(autocompleteInteraction.options.getSubcommand).mockReturnValue(
				"sub",
			);
			await parentCommand.autocomplete?.(autocompleteInteraction, {
				commands: new Map(),
			});
			expect(testSubcommand.autocomplete).toHaveBeenCalledWith(
				autocompleteInteraction,
				{ commands: new Map() },
			);
		});

		it("should do nothing if the subcommand has no autocomplete method", async () => {
			vi.mocked(autocompleteInteraction.options.getSubcommand).mockReturnValue(
				"sub-no-auto",
			);
			await parentCommand.autocomplete?.(autocompleteInteraction, {
				commands: new Map(),
			});
			expect(testSubcommandNoAutocomplete.execute).not.toHaveBeenCalled();
		});

		it("should do nothing if the subcommand is not found", async () => {
			vi.mocked(autocompleteInteraction.options.getSubcommand).mockReturnValue(
				"nonexistent",
			);
			await parentCommand.autocomplete?.(autocompleteInteraction, {
				commands: new Map(),
			});
			expect(testSubcommand.autocomplete).not.toHaveBeenCalled();
			expect(testSubcommandNoAutocomplete.execute).not.toHaveBeenCalled();
		});
	});
});
