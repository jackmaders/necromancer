export function getObjectProperty(object: unknown, property: string) {
	if (!object) {
		return null;
	}

	if (typeof object !== "object") {
		return null;
	}

	if (property in object) {
		return (object as Record<string, unknown>)[property];
	}

	return null;
}
