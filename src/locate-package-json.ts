import { findUp } from "find-up";

/**
 * @internal
 */
export async function locatePackageJson(): Promise<string> {
	const result = await findUp("package.json");
	if (result) {
		return result;
	} else {
		throw new Error("Failed to locate package.json");
	}
}
