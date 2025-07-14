import type { Poll, Team } from "prisma/generated/prisma-client-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { type MockProxy, mock } from "vitest-mock-extended";
import { TeamDoesNotExistError, teamService } from "@/entities/team";
import { getUpcomingMonday } from "@/shared/lib/index.ts";
import { availabilityRepository } from "../../api/availability-repository.ts";
import { availabilityService } from "../availability-service.ts";

vi.mock("@/entities/team");
vi.mock("@/shared/lib/index.ts");
vi.mock("../../api/availability-repository.ts");

describe("Availability Service", () => {
	let team: MockProxy<Team>;
	let poll: MockProxy<Poll>;

	beforeEach(() => {
		team = mock<Team>();
		poll = mock<Poll>();
	});

	describe("createPoll", () => {
		it("should fetch team, get date, and create a poll record via the repository", async () => {
			vi.mocked(teamService.getTeamByName).mockResolvedValue(team);
			vi.mocked(availabilityRepository.createPoll).mockResolvedValue(poll);

			const result = await availabilityService.createPoll(
				team.guildId,
				team.name,
			);

			expect(teamService.getTeamByName).toHaveBeenCalledWith(
				team.guildId,
				team.name,
			);
			expect(getUpcomingMonday).toHaveBeenCalledOnce();
			expect(availabilityRepository.createPoll).toHaveBeenCalledWith(
				team.id,
				getUpcomingMonday(),
			);
			expect(result).toEqual(poll);
		});

		it("should re-throw a TeamDoesNotExistError if the team is not found", async () => {
			const error = new TeamDoesNotExistError(team.name);
			vi.mocked(teamService.getTeamByName).mockRejectedValue(error);

			await expect(() =>
				availabilityService.createPoll(team.guildId, team.name),
			).rejects.toThrow(TeamDoesNotExistError);

			expect(availabilityRepository.createPoll).not.toHaveBeenCalled();
		});
	});

	describe("setPollMessageId", () => {
		it("should call the repository to update the message ID", async () => {
			poll.messageId = "new-message-id";

			vi.mocked(availabilityRepository.updateMessageId).mockResolvedValue(poll);

			const result = await availabilityService.setPollMessageId(
				poll.id,
				poll.messageId,
			);

			expect(availabilityRepository.updateMessageId).toHaveBeenCalledWith(
				poll.id,
				poll.messageId,
			);
			expect(result).toEqual(poll);
		});
	});
});
