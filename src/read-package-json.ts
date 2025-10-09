import { promises as fs } from "node:fs";
import { locatePackageJson } from "./locate-package-json";

/**
 * @internal
 */
export interface PkgJson {
	peerDependencies?: Record<string, string>;
}

/**
 * @internal
 */
export async function readPackageJson(pkgFile?: string): Promise<PkgJson> {
	pkgFile ??= await locatePackageJson();
	const content = await fs.readFile(pkgFile, "utf-8");
	return JSON.parse(content) as PkgJson;
}
