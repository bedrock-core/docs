---
slug: /
sidebar_position: 1
sidebar_label: Overview
description: "@bedrock-core/cli scaffolds Minecraft Bedrock addons with builder profiles, TypeScript, translations, guides and example screens."
---

# cli

`@bedrock-core/cli` scaffolds an addon with the @bedrock-core builder, server
registration, typed config, translations, MDX guides and three UI screens.
Its source and templates belong to the [builder repository](https://github.com/bedrock-core/builder).

:::caution Beta
The builder checkout prepares local archives and keeps its packages private.
Install those archives in generated projects when the configured builder version
is unavailable from the registry. The UI stage requires a matching toolkit with
`buildUiPack`; use compatible local UI
archives when registry packages do not expose these APIs.
:::

## Usage

Use Node.js 22.18 or newer. From the builder checkout:

```sh
corepack yarn install --immutable
corepack yarn scaffold my-addon --author "Your Name" --description "My addon" --package-manager none
```

An installed CLI archive accepts the same arguments through its `cli` binary.

| Argument or flag | Description |
| --- | --- |
| `[project-name]` | Directory and npm package name; omitted values are prompted |
| `-a, --author <name>` | Author name |
| `-d, --description <text>` | Project description |
| `-p, --package-manager <manager>` | `yarn`, `npm`, `pnpm`, or `none` |
| `-V, --version` | Print the CLI version |
| `-h, --help` | Print usage |

The CLI validates npm package names and refuses nonempty target directories.
Git initialization creates a repository without a commit. Choose `none` to
create the files without installing dependencies. Otherwise, the selected
manager installs the build tools and runtime packages together.

The Yarn choice creates its lockfile before installation to isolate the generated
project from any parent Yarn checkout. If you choose `none` and later install
with Yarn inside another Yarn project, create an empty `yarn.lock` first.

The template pins an exact UI version and downloads its matching
`core-ui-<version>.mcpack`. If download fails, the CLI prints the matching UI
release link and preserves the project. Import that resource pack into the
world where the addon runs.

## Project structure

```text
my-addon/
├── config.json
├── package.json
├── tsconfig.json
├── tsconfig.test.json
├── eslint.config.mjs
├── .vscode/
├── i18n/en_US.ts
├── guides/en_US/
└── packs/
    ├── BP/
    │   ├── manifest.json
    │   ├── manifest.test.json
    │   ├── blocks/tutorial.block.ts
    │   ├── entities/training_dummy.entity.ts
    │   ├── structures/example/the_addon_loads.mcstructure
    │   ├── texts/
    │   └── scripts/
    │       ├── main.ts
    │       ├── gametest.ts
    │       ├── config.ts
    │       ├── tests/index.ts
    │       └── UI/
    │           ├── i18n.ts
    │           └── screens/
    │               ├── home.screen.tsx
    │               ├── plan.screen.tsx
    │               └── profile_form.screen.tsx
    └── RP/
        ├── manifest.json
        └── texts/
```

The addon namespace combines sanitized author and project identifiers.
`config.json` declares it once alongside named pack paths and
`bedrockCore.profiles`. The builder detects and runs manifest, generator,
guides, i18n, UI compiler and bundler stages in dependency order.
See [builder configuration](/docs/builder/guides/configuration) for settings.

| Profile | Script | Export |
| --- | --- | --- |
| `build` | `build` | `build/<project>_bp` and `build/<project>_rp` |
| `default` | `watch` | Windows Minecraft development folders; debug output and UI build stamp |
| `test` | `watch:test` | Development folders with the GameTest manifest and entry |
| `build-test` | `build:test` | `build/test/BP` and `build/test/RP` |

The watch destinations use
`%APPDATA%/Minecraft Bedrock/Users/Shared/games/com.mojang/`.
Change their explicit export paths for another installation or platform.
Update the VS Code debugger paths to match.

## Build and develop

Use the package manager selected during scaffolding and commit its lockfile.
Yarn uses a conventional `node_modules` linker; pnpm uses a hoisted layout.

<PackageCommands
  npm={`cd my-addon
npm run build
npm run watch
npm run lint`}
  yarn={`cd my-addon
yarn build
yarn watch
yarn lint`}
  pnpm={`cd my-addon
pnpm build
pnpm watch
pnpm lint`}
/>

Every build command invokes the project's `bc-builder` executable. The
`plan` script prints the selected pipeline.

The first build writes editor declarations under
`.bedrock-core/generated/`. The template's tsconfig includes them.
Generated imports such as `@bedrock-core/generated/i18n`,
`@bedrock-core/generated/guides` and `@bedrock-core/generated/ui` are resolved
by the builder within its staged project.

Translations live in `i18n/`; guides live in `guides/`. Typed JSON templates
remain under the authored packs. The builder compiles them into staged outputs
and exports completed packs after validation.

## GameTests

The normal manifest selects `scripts/main.js`. The test manifest extends it,
adds the beta GameTest module and selects `scripts/gametest.js`. That entry
imports the addon and its test suite. The `test` and `build-test` profiles
select this manifest and `tsconfig.test.json`; normal builds omit the beta
module.

Run `build:test` before using [bds-runner](/docs/bds-runner) against
`build/test/BP`. The reusable structure and the test tagged `example` are
included in the starter.

## Next steps

- [Builder](/docs/builder) — stages, plugins, exports and watch behavior
- [Render pack](/docs/ui/guides/render-pack) — importing the shared textures
- [i18n](/docs/i18n) — typed translations
- [Guides](/docs/guides) — MDX content in game
- [Server runtime](/docs/server/api/runtime) — addon registration
