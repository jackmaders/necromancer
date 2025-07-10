export class TeamAlreadyExistsError extends Error {
	constructor(teamName: string) {
		super(`A team with the name "${teamName}" already exists.`);
		this.name = "TeamExistsError";
	}
}
export class TeamDoesNotExistsError extends Error {
	constructor(teamName: string) {
		super(`A team with the name "${teamName}" does not exist.`);
		this.name = "TeamDoesNotExistsError";
	}
}
