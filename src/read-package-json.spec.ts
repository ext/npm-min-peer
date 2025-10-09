import path from "node:path";
import { beforeEach, expect, it, vi } from "vitest";
import * as locatePackageJsonModule from "./locate-package-json";
import { readPackageJson } from "./read-package-json";

vi.mock(import("./locate-package-json"));

const locatePackageJson = vi.spyOn(locatePackageJsonModule, "locatePackageJson");

beforeEach(() => {
	locatePackageJson.mockClear();
});

it("should read and parse given filename", async () => {
	expect.assertions(2);
	const filePath = path.join(__dirname, "__fixtures__", "default.json");
	const result = await readPackageJson(filePath);
	expect(locatePackageJson).not.toHaveBeenCalled();
	expect(result).toMatchInlineSnapshot(`
		{
		  "name": "default",
		  "peerDependencies": {},
		  "version": "1.2.3",
		}
	`);
});

it("should locate package.json if no filename is given", async () => {
	expect.assertions(2);
	const filePath = path.join(__dirname, "__fixtures__", "default.json");
	locatePackageJson.mockResolvedValue(filePath);
	const result = await readPackageJson();
	expect(locatePackageJson).toHaveBeenCalledExactlyOnceWith();
	expect(result).toMatchInlineSnapshot(`
		{
		  "name": "default",
		  "peerDependencies": {},
		  "version": "1.2.3",
		}
	`);
});

it("should throw error if file does not exist", async () => {
	expect.assertions(1);
	const filePath = "missing.json";
	await expect(() => readPackageJson(filePath)).rejects.toThrowErrorMatchingInlineSnapshot(
		`[Error: ENOENT: no such file or directory, open 'missing.json']`,
	);
});
