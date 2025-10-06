import { beforeEach, expect, it, vi } from "vitest";
import { locatePackageJson } from "./locate-package-json";

let mockResult = vi.hoisted(() => undefined as string | undefined);

vi.mock(import("find-up"), () => {
	return {
		findUp: vi.fn(() => Promise.resolve(mockResult)),
	};
});

beforeEach(() => {
	mockResult = undefined;
});

it("should try to locate package.json", async () => {
	expect.assertions(1);
	mockResult = "/path/to/package.json";
	expect(await locatePackageJson()).toBe("/path/to/package.json");
});

it("should throw error if package.json couldn't be found", async () => {
	expect.assertions(1);
	mockResult = undefined;
	await expect(() => locatePackageJson()).rejects.toThrowErrorMatchingInlineSnapshot(
		`[Error: Failed to locate package.json]`,
	);
});
