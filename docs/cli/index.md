---
slug: /
sidebar_position: 1
sidebar_label: Overview
description: "Create a Minecraft Bedrock project with build, watch, test and pack optimization commands."
---
# cli

Create a JavaScript or TypeScript project with the packs and tools you need.

## Create a project

Use Node.js 22.18 or newer:

<Exec cmd="@bedrock-core/cli my-project" />

The CLI prompts for missing details and your package manager, creates a Git repository without a commit, and installs dependencies. Choose `none` to create files without installing them.

## Choose a starter

| Preset | Packs | Included content |
| --- | --- | --- |
| `full` (default) | Behavior and resource | Runtime registration, config, translations, guides, JSX screens, JSON templates and a GameTest |
| `script` | One behavior pack | Plain Minecraft scripting and a GameTest |
| `resource` | One resource pack | Resource-pack manifest and language files |

<PackageCommands
  npm={`npx @bedrock-core/cli my-script --preset script
npx @bedrock-core/cli my-textures --preset resource`}
  yarn={`yarn dlx @bedrock-core/cli my-script --preset script
yarn dlx @bedrock-core/cli my-textures --preset resource`}
  pnpm={`pnpm dlx @bedrock-core/cli my-script --preset script
pnpm dlx @bedrock-core/cli my-textures --preset resource`}
/>

These are starting layouts. A [project can contain any number of packs](/docs/builder/guides/projects), including independent addons.

## Build and develop

<PackageCommands
  npm={`cd my-project
npm run build
npm run watch`}
  yarn={`cd my-project
yarn build
yarn watch`}
  pnpm={`cd my-project
pnpm build
pnpm watch`}
/>

`build` exports the completed packs to `build/`. `watch` rebuilds into Minecraft's development folders after changes. Edit the `default` profile's export paths for your installation; the generated defaults use Windows Minecraft development folders.

The full starter downloads the shared UI resource pack matching its pinned UI version. Import that `.mcpack` into the world for client testing. If the download fails, the CLI prints the exact release link and preserves the project.

## Test and optimize

The full and script starters include one headless GameTest:

<PackageCommands
  npm="npm run test:mc"
  yarn="yarn test:mc"
  pnpm="pnpm test:mc"
/>

This builds the test profile and runs the `example` suite on BDS. The test manifest selects `gametest.js` and enables the beta GameTest module; regular builds select `main.js`. Add tests under the behavior pack's `scripts/tests/` directory and update the command's `--expect-registered` count when the suite grows.

Every starter includes pack optimization for Windows:

<PackageCommands
  npm="npm run build:optimized"
  yarn="yarn build:optimized"
  pnpm="pnpm build:optimized"
/>

Optimized output goes to `dist/`. The `build-optimized` profile exports production packs to `build/production/` for conversion. `bds-runner.json` pins the server used for both tests and conversion. Run `bds:fetch` to download it or `bds:where` to inspect the selection. [BDS runner](/docs/bds-runner) explains results and supported inputs.

Resource-only projects have no GameTest registration; add a behavior pack test harness when testing their resources with GameTests. Client rendering and input need in-game checks.

## Project files

| File or directory | Purpose |
| --- | --- |
| `config.json` | Project metadata, pack paths, profiles and exports |
| `package.json` | Dependencies, project version and commands |
| `packs/` | Authored packs; each has its own manifest |
| `bds-runner.json` | Pinned headless server |
| `.bedrock-core/` | Generated editor declarations and local build cache |

The full starter demonstrates [JSON generation](/docs/builder/guides/generating-json), [translations](/docs/i18n/authoring), [guides](/docs/guides/authoring) and [navigation](/docs/navigation/guides/getting-started). Keep the features your project needs.

## Command options

| Option | Purpose |
| --- | --- |
| `[project-name]` | Directory and npm package name |
| `--preset <preset>` | `full`, `script` or `resource` |
| `-a, --author <name>` | Author display name |
| `-d, --description <text>` | Project description |
| `-p, --package-manager <manager>` | `npm`, `yarn`, `pnpm` or `none` |
| `--display-name <name>` | Human-readable project name |
| `--creator-id <id>` / `--pack-id <id>` | Stable runtime identifiers, independent of display names |

Show the full command reference:

<Exec cmd="@bedrock-core/cli --help" />

## Next steps

- [Projects and packs](/docs/introduction/projects) — understand the project model
- [Builder configuration](/docs/builder/guides/configuration) — edit profiles and exports
- [Generate JSON](/docs/builder/guides/generating-json) — author typed content
- [BDS commands](/docs/bds-runner/cli) — run suites and optimize packs
