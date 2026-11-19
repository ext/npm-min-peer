import Range from "semver/classes/range";
import minVersion from "semver/ranges/min-version";
import { readPackageJson } from "./read-package-json";

/**
 * Options for [[getMinPeer]].
 *
 * @public
 */
export interface Options {
	/** If set it constraints the returned version to this version, i.e. the returned version will be between [N .. N+1] or an error if this major is not supported at all. */
	major?: string | number;
	/** If enabled the returned string will include the package name, useful when passing the result directly to `npm install` */
	withName?: boolean;
	/** Filename to read `package.json` from */
	pkgFile?: string;
}

function formatResult(pkgName: string, version: string, options: Options): string {
	if (options.withName) {
		return `${pkgName}@${version}`;
	}
	return version;
}

function minVersionForMajor(
	expression: string,
	major: string | number,
): ReturnType<typeof minVersion> {
	const peerRange = new Range(expression);
	const majorRange = new Range(`^${String(major)}`);
	let minResult: ReturnType<typeof minVersion> = null;
	for (const peerComparators of peerRange.set) {
		for (const majorComparators of majorRange.set) {
			const comparators = [...peerComparators, ...majorComparators]
				.map((comparator) => comparator.value)
				.join(" ");
			const result = minVersion(comparators);
			if (result && (!minResult || result.compare(minResult) < 0)) {
				minResult = result;
			}
		}
	}
	return minResult;
}

/**
 * Get minimum version required by a peerDependency.
 *
 * @public
 * @param pkgName - Package name to get version for.
 * @param options - Options.
 */
export async function getMinPeer(pkgName: string, options: Options = {}): Promise<string> {
	const { peerDependencies } = await readPackageJson(options.pkgFile);
	if (!peerDependencies) {
		throw new Error(`"peerDependencies" not defined in "package.json"`);
	}

	const expression = peerDependencies[pkgName];
	if (expression === undefined) {
		throw new TypeError(`"${pkgName}" is not listed in "peerDependencies" in "package.json"`);
	}

	const { major } = options;
	if (major === undefined) {
		let result;
		try {
			result = minVersion(expression);
		} catch {
			throw new Error(`No version could be found for "${expression}"`);
		}
		if (!result) {
			throw new Error(`No version could be found for "${expression}"`);
		}
		return formatResult(pkgName, result.version, options);
	}

	const result = minVersionForMajor(expression, major);
	if (result) {
		return formatResult(pkgName, result.version, options);
	}

	throw new Error(
		`No version could be found for "${expression}" that matches major "${String(major)}"`,
	);
}
