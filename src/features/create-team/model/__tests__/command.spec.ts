import { describe, expect, it } from "vitest";
import { InteractionBuilder } from "@/testing/interaction-builder.ts";
import { createTeamSubcommand } from "../../index.ts";

describe("Create Team Subcommand", () => {
	it("should handle an interaction", async () => {
		const interaction = new InteractionBuilder("team").build();
		await createTeamSubcommand.execute(interaction);

		expect(interaction.reply).toHaveBeenCalledWith({
			content: "Creating Team...",
		});
	});
});
