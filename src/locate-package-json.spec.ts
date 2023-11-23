import { locatePackageJson } from "./locate-package-json";

let mockResult: string | undefined = undefined;

jest.mock("find-up", () =>
	jest.fn().mockImplementation(() => {
		return Promise.resolve(mockResult);
	}),
);

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
		`"Failed to locate package.json"`,
	);
});
