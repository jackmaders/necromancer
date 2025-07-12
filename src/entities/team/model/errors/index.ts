import { AppError } from "@/shared/model/errors/app-error";

export class TeamAlreadyExistsError extends AppError {
	constructor(teamName: string, options?: ErrorOptions) {
		const display = `A team with the name "${teamName}" already exists.`;

		super(display, undefined, options);
	}
}

export class TeamDoesNotExistError extends AppError {
	constructor(teamName: string, options?: ErrorOptions) {
		const display = `A team with the name "${teamName}" does not exist.`;

		super(display, undefined, options);
	}
}
