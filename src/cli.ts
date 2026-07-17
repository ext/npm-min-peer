import { parseArgs } from "node:util";
import { getMinPeer } from "./get-min-peer";

/* eslint-disable-next-line @typescript-eslint/no-require-imports -- technical debt, should be replaced with fs.readfile */
const { version, description } = require("../package.json") as {
	version: string;
	description: string;
};

interface Args {
	pkgName: string;
	major?: string;
	withName?: boolean;
}

const usage = `usage: npm-min-peer [-h] [-v] [--major MAJOR] [--with-name] PACKAGE

${description}

positional arguments:
  PACKAGE        package name to find version for

options:
  -h, --help     show this help message and exit
  -v, --version  show program's version number and exit
  --major MAJOR  constrain version to this major
  --with-name    include package name in output`;

/**
 * @internal
 */
export async function cli(argv: string[]): Promise<number> {
	const { values, positionals } = parseArgs({
		args: argv,
		options: {
			help: { type: "boolean", short: "h" },
			version: { type: "boolean", short: "v" },
			major: { type: "string" },
			"with-name": { type: "boolean" },
		},
		allowPositionals: true,
	});

	if (values.help) {
		console.log(usage); // eslint-disable-line no-console -- expected to log
		return 0;
	}

	if (values.version) {
		console.log(version); // eslint-disable-line no-console -- expected to log
		return 0;
	}

	const [pkgName] = positionals;
	if (!pkgName) {
		console.error(usage); // eslint-disable-line no-console -- expected to log
		return 1;
	}

	const args: Args = {
		pkgName,
		...(values.major !== undefined && { major: values.major }),
		...(values["with-name"] !== undefined && { withName: values["with-name"] }),
	};
	const result = await getMinPeer(args.pkgName, args);
	console.log(result); // eslint-disable-line no-console -- expected to log
	return 0;
}
