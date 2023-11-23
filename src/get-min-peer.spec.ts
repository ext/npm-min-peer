import { getMinPeer } from "./get-min-peer";
import * as readPackageJsonModule from "./read-package-json";

jest.mock("./read-package-json");

const readPackageJson = jest.spyOn(readPackageJsonModule, "readPackageJson");

beforeEach(() => {
	readPackageJson.mockClear();
});

describe("should return minimum version of package", () => {
	it.each`
		range           | result
		${">= 2.3.4"}   | ${"2.3.4"}
		${"^2.1 || ^3"} | ${"2.1.0"}
	`('"$range" should be "$result"', async ({ range, result }) => {
		expect.assertions(1);
		readPackageJson.mockResolvedValue({
			peerDependencies: {
				foo: range,
			},
		});
		expect(await getMinPeer("foo")).toBe(result);
	});
});

it("should return version with package name", async () => {
	expect.assertions(1);
	readPackageJson.mockResolvedValue({
		peerDependencies: {
			foo: ">= 2.3.4",
		},
	});
	expect(await getMinPeer("foo", { withName: true })).toBe("foo@2.3.4");
});

it("should support passing filename to readPackageJson", async () => {
	expect.assertions(1);
	readPackageJson.mockResolvedValue({
		peerDependencies: {
			foo: ">= 2.3.4",
		},
	});
	await getMinPeer("foo", { pkgFile: "my-file.json" });
	expect(readPackageJson).toHaveBeenCalledWith("my-file.json");
});

describe("should constrain to given major", () => {
	it.each`
		range                 | major  | result
		${">= 2.3.4"}         | ${"2"} | ${"2.3.4"}
		${">= 2.3.4"}         | ${"3"} | ${"3.0.0"}
		${"^2.1 || ^3"}       | ${"2"} | ${"2.1.0"}
		${"^2.1 || ^3"}       | ${"3"} | ${"3.0.0"}
		${">= 2.3 || >= 3.1"} | ${"3"} | ${"3.0.0"}
	`('"$range" with major "$major" should be "$result"', async ({ range, major, result }) => {
		expect.assertions(1);
		readPackageJson.mockResolvedValue({
			peerDependencies: {
				foo: range,
			},
		});
		expect(await getMinPeer("foo", { major })).toBe(result);
	});
});

describe("should handle different major formats", () => {
	it.each([
		["1 (number)", 1],
		["1 (string)", "1"],
		["1.x", "1.x"],
		["v1", "v1"],
		["v1.x", "v1.x"],
	])("%s", async (_, major) => {
		expect.assertions(1);
		readPackageJson.mockResolvedValue({
			peerDependencies: {
				foo: "^1.3.2",
			},
		});
		expect(await getMinPeer("foo", { major })).toBe("1.3.2");
	});
});

describe("should throw error when", () => {
	it("peerDependencies is not defined", async () => {
		expect.assertions(1);
		readPackageJson.mockResolvedValue({});
		await expect(() => getMinPeer("foo")).rejects.toThrowErrorMatchingInlineSnapshot(
			`""peerDependencies" not defined in "package.json""`,
		);
	});

	it("package is not listed in peerDependencies", async () => {
		expect.assertions(1);
		readPackageJson.mockResolvedValue({ peerDependencies: {} });
		await expect(() => getMinPeer("foo")).rejects.toThrowErrorMatchingInlineSnapshot(
			`""foo" is not listed in "peerDependencies" in "package.json""`,
		);
	});

	it("peerDependency has impossible range", async () => {
		expect.assertions(1);
		readPackageJson.mockResolvedValue({ peerDependencies: { foo: ">4 <3" } });
		await expect(() => getMinPeer("foo")).rejects.toThrowErrorMatchingInlineSnapshot(
			`"No version could be found for ">4 <3""`,
		);
	});

	it("peerDependency has invalid range", async () => {
		expect.assertions(1);
		readPackageJson.mockResolvedValue({ peerDependencies: { foo: "bar" } });
		await expect(() => getMinPeer("foo")).rejects.toThrowErrorMatchingInlineSnapshot(
			`"No version could be found for "bar""`,
		);
	});

	it("peerDependency does not allow requested major", async () => {
		expect.assertions(1);
		readPackageJson.mockResolvedValue({ peerDependencies: { foo: "^1" } });
		await expect(() => getMinPeer("foo", { major: 2 })).rejects.toThrowErrorMatchingInlineSnapshot(
			`"No version could be found for "^1" that matches major "2""`,
		);
	});
});
