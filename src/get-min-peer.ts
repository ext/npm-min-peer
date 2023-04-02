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
	} else {
		return version;
	}
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
	if (typeof expression === "undefined") {
		throw new Error(`"${pkgName}" is not listed in "peerDependencies" in "package.json"`);
	}

	const { major } = options;
	if (!major) {
		let result;
		try {
			result = minVersion(expression);
		} catch (err) {
			throw new Error(`No version could be found for "${expression}"`);
		}
		if (!result) {
			throw new Error(`No version could be found for "${expression}"`);
		}
		return formatResult(pkgName, result.version, options);
	}

	for (const range of expression.split("||")) {
		const result = minVersion(`${range.trim()} ^${major}`);
		if (result) {
			return formatResult(pkgName, result.version, options);
		}
	}

	throw new Error(`No version could be found for "${expression}" that matches major "${major}"`);
}
