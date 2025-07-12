/**
 * A "middle-man" error class that all custom application errors should extend.
 * This allows for easy identification of custom errors that have a user-facing message.
 */
export class AppError extends Error {
	readonly display: string;

	constructor(display: string, internal?: string, options?: ErrorOptions) {
		super(internal ?? display, options);
		this.name = this.constructor.name;
		this.display = display ?? internal;

		Object.setPrototypeOf(this, new.target.prototype);
	}
}
