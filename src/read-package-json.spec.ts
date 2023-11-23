import path from "path";
import { readPackageJson } from "./read-package-json";
import * as locatePackageJsonModule from "./locate-package-json";

jest.mock("./locate-package-json");

const locatePackageJson = jest.spyOn(locatePackageJsonModule, "locatePackageJson");

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
	expect(locatePackageJson).toHaveBeenCalledWith();
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
		`"ENOENT: no such file or directory, open 'missing.json'"`,
	);
});
