import { ArgumentParser } from "argparse";
import { getMinPeer } from "./get-min-peer";

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const { version, description } = require("../package.json") as {
	version: string;
	description: string;
};

interface Args {
	pkgName: string;
	major?: string;
	withName?: boolean;
}

/**
 * @internal
 */
export async function cli(argv: string[]): Promise<number> {
	const parser = new ArgumentParser({
		description,
	});

	parser.add_argument("-v", "--version", { action: "version", version });
	parser.add_argument("--major", { help: "constrain version to this major" });
	parser.add_argument("--with-name", {
		help: "include package name in output",
		dest: "withName",
		action: "store_true",
	});
	parser.add_argument("pkgName", { help: "package name to find version for", metavar: "PACKAGE" });

	const args = parser.parse_args(argv) as Args;
	const result = await getMinPeer(args.pkgName, args);
	console.log(result); // eslint-disable-line no-console
	return 0;
}
