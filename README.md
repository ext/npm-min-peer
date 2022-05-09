# `npm-min-peer`

[![Build](https://github.com/ext/npm-min-peer/workflows/Build/badge.svg)](https://github.com/ext/min-min-peer/actions?query=workflow%3ABuild)
[![Coverage Status](https://coveralls.io/repos/github/ext/npm-min-peer/badge.svg?branch=master)](https://coveralls.io/github/ext/min-min-peer?branch=master)

Get minimum version required by a peerDependency.

This is typically useful when running a matrix CI pipeline when you want to test all supported versions of a dependency.

## Usage

> npx min-min-peer PACKAGE [--help] [--version] [--major MAJOR] [--with-name]

Use `--help` to see full usage help.

Use `--version` to see package version.

Use `--major` to specify which major version to use when finding the minumum.
Major can be specified using any of the following formats:

  - `1`
  - `"1"`
  - `"1.x"`
  - `"v1"`
  - `"v1.x"`

Use `--with-name` to include the package name in output.

The exit code will be non-zero if the major is not supported or the package is not found.

Given a `package.json` like:

```json
{
  "name": "my-fancy-package",
  "version": "1.2.3",
  "peerDependency": {
    "my-fancy-dependency": "^3.4.5 || >= 4.0.0"
  }
}
```

the output from the tool will be:

```
$ npx npm-min-peer my-fancy-dependency
3.4.5
$ npx npm-min-peer my-fancy-dependency --major 3
3.4.5
$ npx npm-min-peer my-fancy-dependency --major 4 --with-name
my-fancy-dependency@4.0.0
```

### Usage with Github Actions

```yaml
jobs:
  build:
    strategy:
      matrix:
        version: [3, 4, 5]
    steps:
      - name: Install dependencies
        run: npm ci
      - name: Install my-fancy-dependency v${{ matrix.version }}
        run: npm install --no-save $(npx -y npm-min-peer my-fancy-dependency --major ${{ matrix.version }} --with-name)
      - name: Run tests
        run: npm test
```

### Usage with Gitlab CI

```yaml
my-fancy-dependency:
  parallel:
    matrix:
      - VERSION: [3, 4, 5]
  before_script:
    - npm ci
    - npm install --no-save $(npx -y npm-min-peer my-fancy-dependency --major ${VERSION} --with-name)
  script:
    - npm test
```

## API

This can also be used with an API:

```ts
import { getMinPeer } from "npm-min-peer";

console.log(await getMinPeer("my-fancy-dependency")); // > 3.4.5
console.log(await getMinPeer("my-fancy-dependency", { major: 4, withName: true })); // > my-fancy-dependency@4.0.0
```

### `getMinPeer(pkgName: string, options?: Options): Promise<string>`

- `pkgName` - name of the `peerDependency` to get version for.
- `options.major` - Major version (corresponding to `--major`)
- `options.withName` - Include name in output (corresponding to `--with-name`)
- `options.pkgFile` - Path to `package.json` to read (default: find closest `package.json` by traversing filesystem).

Returns promise resolved with package version or rejected if the package could not be found or does not match the given major version.
