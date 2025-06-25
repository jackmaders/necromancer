import type {
	ChatInputCommandInteraction,
	InteractionReplyOptions,
	InteractionResponse,
	MessagePayload,
} from "discord.js";
import { vi } from "vitest";
import { mock } from "vitest-mock-extended";

export class InteractionBuilder {
	private readonly _interaction: ChatInputCommandInteraction;

	/**
	 * @param commandName The name of the command for this interaction.
	 */
	constructor(commandName = "test") {
		this._interaction = mock<ChatInputCommandInteraction>();

		// biome-ignore lint/suspicious/noExplicitAny: overriding readonly property
		(this._interaction as any).createdTimestamp = Date.now();
		this._interaction.id = crypto.randomUUID();
		this._interaction.commandName = commandName;
		this._interaction.deferred = false;
		this._interaction.replied = false;

		vi.mocked(this._interaction.isChatInputCommand).mockReturnValue(true);
		vi.mocked(this._interaction.isRepliable).mockReturnValue(true);
	}

	/**
	 * Marks the interaction as deferred.
	 */
	deferred() {
		this._interaction.deferred = true;
		return this;
	}

	/**
	 * Marks the interaction as already having been replied to.
	 */
	replied() {
		this._interaction.replied = true;
		return this;
	}

	/**
	 * Mocks the `reply` method to simulate network latency,
	 * @param latencyMs The simulated latency in milliseconds.
	 */
	withReplyLatency(latencyMs: number): this {
		const mockReplyMessage = mock<InteractionResponse>();
		// biome-ignore lint/suspicious/noExplicitAny: overriding readonly property
		(mockReplyMessage as any).createdTimestamp =
			this._interaction.createdTimestamp + latencyMs;

		vi.mocked(this._interaction.reply).mockImplementation(
			// biome-ignore lint/suspicious/useAwait: mirroring existing async function
			async (options: string | MessagePayload | InteractionReplyOptions) => {
				if (!(typeof options === "object" && "fetchReply" in options)) {
					return {} as InteractionResponse;
				}

				return mockReplyMessage;
			},
		);

		return this;
	}

	/**
	 * Overrides specific properties on the mock.
	 * @param overrides An object of properties to merge into the mock.
	 */
	with(overrides: Partial<ChatInputCommandInteraction>): this {
		Object.assign(this._interaction, overrides);
		return this;
	}

	build(): ChatInputCommandInteraction {
		return this._interaction;
	}
}
