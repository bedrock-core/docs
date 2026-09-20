---
slug: /
sidebar_position: 1
sidebar_label: Overview
description: "@bedrock-core/cli scaffolds a complete Minecraft Bedrock addon project — Regolith build, TypeScript, ESLint, the full bedrock-core stack, and a working…"
---

# cli

`@bedrock-core/cli` scaffolds a complete Minecraft Bedrock addon project — Regolith build, TypeScript, ESLint, the full bedrock-core stack, and three working example screens — in one command.


:::caution Beta
`@bedrock-core/cli` is in beta: the API can change between releases. Pin exact versions and read the changelog before upgrading.
:::

<Exec cmd="@bedrock-core/cli" />

## Usage

<Exec cmd="@bedrock-core/cli [project-name]" />

| Argument | Required | Description |
| --- | --- | --- |
| `[project-name]` | no | The project directory. Passing it skips the first prompt |

| Flag | Description |
| --- | --- |
| `-a, --author <name>` | Author name. Skips the author prompt |
| `-d, --description <text>` | Project description. Skips the description prompt |
| `-V, --version` | Print the CLI version |
| `-h, --help` | Print usage |

No template switch and no package-manager choice — the template ships a `yarn.lock`.

### Prompts

Three text prompts, all with defaults you can accept with Enter. `[project-name]` and `--author`/`--description` each skip their own prompt, so a fully-flagged invocation runs with no prompts at all:

| Prompt | Default | Validation |
| --- | --- | --- |
| `Project name:` | `my-addon` | Must be a valid new npm package name (this becomes the directory and `package.json` name) |
| `Author name:` | `Your Name` | — |
| `Description:` | `A Minecraft Bedrock addon with custom UI` | — |

Ctrl-C prints `✖ Operation cancelled` and exits cleanly. The CLI refuses to write into a directory that already exists and is not empty.

## What gets scaffolded

The template scaffolds the **whole bedrock-core stack**, not just a UI: [server runtime](/docs/server/api/runtime) registration, the addon catalog, the shared config UI, typed translations, MDX guides, JSON generation from TypeScript, a GameTest suite, and three themed example screens covering navigation, a navigated param and a native modal form.

```txt
my-addon/
├── config.json                       Regolith: `core` plus six declared stages, four profiles
├── package.json                      scripts: regolith-install / build / build:test / watch / watch:test / lint
├── tsconfig.json                     JSX + the two @bedrock-core/generated aliases
├── tsconfig.test.json                extends tsconfig.json; entry is scripts/gametest.ts
├── eslint.config.mjs
├── .vscode/                          launch.json wired to the Minecraft debugger (port 19144)
├── core-ui-v*.mcpack                 render pack, downloaded for you
└── packs/
    ├── BP/
    │   ├── manifest.json
    │   ├── manifest.test.json                extends manifest.json, adds @minecraft/server-gametest
    │   ├── blocks/tutorial.block.ts          generator sample — one file, many blocks
    │   ├── entities/training_dummy.entity.ts generator sample — single file
    │   ├── texts/{en_US.lang, languages.json}
    │   └── scripts/
    │       ├── main.ts                       core.register(...) + events
    │       ├── gametest.ts                   the test-profile entry: imports ./main and ./tests
    │       ├── config.ts                     typed config schema
    │       ├── tests/index.ts                GameTest suite, tagged "example"
    │       └── UI/
    │           ├── screens/
    │           │   ├── home.screen.tsx           ore-styled screen, navigation and local state
    │           │   ├── plan.screen.tsx            reads a navigated param, `back` button
    │           │   └── profile_form.screen.tsx    a native modal form
    │           └── i18n.ts                   createI18n(bundle)
    ├── RP/
    │   ├── manifest.json
    │   └── texts/{en_US.lang, languages.json}
    └── data/
        ├── guides/en_US/                     intro page + a category + an admonition
        │   ├── intro.mdx
        │   └── getting-started/
        │       ├── _category_.json
        │       └── first-steps.mdx
        ├── i18n/en_US.ts                     meta.* + interpolation + a plural leaf
        └── generated/mc/                      Minecraft document types (gitignored, rebuilt)
```

### The Regolith pipeline

The template pins `core` and all six stages in `filterDefinitions`. Run `regolith install-all`
before its first build: Regolith installs only declared filters, and does not automatically
install the stages that `core` invokes.

`config.json` runs one [`core`](/docs/filters/core) filter in every profile, which chains the six stages in dependency order — manifest, generator, guides, i18n, ui-compiler, bundler — with the namespace declared once as `shared.namespace`:

| Setting | Stage | What it does |
| --- | --- | --- |
| `generator.include` / `exclude` | generator | Widened to every `.ts` under the packs, excluding `BP/scripts` and `data` |
| `manifest.manifestPath` | manifest | `BP/manifest.test.json` in the `test` and `build-test` profiles only |
| `ui-compiler.stamp` | ui-compiler | `true` in `default`, drawing the build-stamp HUD hook |
| `bundler.debug` | bundler | `false` in `build`; `true` everywhere else |
| `bundler.tsConfigPath` | bundler | `tsconfig.test.json` in `test` and `build-test`, whose entry is `gametest.ts` |

Templates are checked against Mojang's official JSON Schemas. The `generator`
stage writes document types into `packs/data/generated/mc/`, so a template is a
plain export with a `satisfies` on the end:

```ts
export default {
  'format_version': '1.21.0',
  'minecraft:entity': { description: { identifier: 'my_addon:training_dummy' } },
} satisfies Entity;
```

`Block`, `Entity`, `Item`, `LootTable`, `Recipe`, `Particle` and 33 more are
global, so nothing is imported and nothing reaches the runtime — `satisfies` is
erased at build time. The generated types are gitignored, so run the build once
after scaffolding.

### Profiles

| Profile | Script | Export | Notes |
| --- | --- | --- | --- |
| `build` | `yarn build` | read-only, `local` | Minified, `bundler.debug: false` — the release build |
| `default` | `yarn watch` | writable, `development` | Laid-out JSON, debug bundle, build-stamp HUD, redeploys on change |
| `test` | `yarn watch:test` | writable, `development` | Same as `default`, resolving `manifest.test.json` and bundling `gametest.ts` |
| `build-test` | `yarn build:test` | read-only, `./build/test/BP` and `./build/test/RP` | The gametest manifest and entry, for [`bds-runner`](/docs/bds-runner) |

### GameTests

`packs/BP/scripts/tests/index.ts` registers one GameTest tagged `example` through `@minecraft/server-gametest`, a beta module only `manifest.test.json` declares. `gametest.ts` — the entry `tsconfig.test.json` names — imports `./main` then `./tests`, so a release build (`main.ts`) never pulls in the test suite or the beta module. `yarn build:test` produces the pack [`bds-runner`](/docs/bds-runner) runs the suite against.

### tsconfig

```json title="tsconfig.json"
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@bedrock-core/ui",
    "moduleResolution": "bundler",
    "paths": {
      "@bedrock-core/generated/i18n":   ["./packs/data/i18n/i18n.generated.json"],
      "@bedrock-core/generated/guides": ["./packs/data/guides/guides.generated.json"]
    }
  },
  "include": ["packs/BP/scripts/**/*", "packs/BP/blocks/**/*", "packs/BP/entities/**/*", "packs/data/**/*"]
}
```

:::caution Build once before the editor is happy
Both generated files are produced by the filters, so a freshly scaffolded project does not typecheck until `yarn build` has run at least once. This is expected — run the build before hunting for missing modules.
:::

A second tsconfig, `tsconfig.test.json`, extends this one and names `packs/BP/scripts/gametest.ts` as its sole entry — the `test` and `build-test` profiles point the bundler at it. See [GameTests](#gametests).

### Manifests

Five UUIDs are generated per project (`crypto.randomUUID()`), one per manifest header and module, plus `BP/manifest.test.json`, which `extends` the BP manifest and adds a dependency on `@minecraft/server-gametest`. Every manifest is `format_version: 3`, so every version field is a SemVer string: both packs use `pack_scope: "world"` and `min_engine_version: "1.26.50"`. Neither bakes its name and description into the manifest: both headers point at `pack.name` / `pack.description` — the only two keys Bedrock resolves for a manifest header — which you author once as `meta.name` / `meta.description` in `packs/data/i18n/<locale>.ts`. The [i18n filter](/docs/i18n/authoring#meta-branch) emits those aliases into each pack's own `texts/<locale>.lang` — a manifest key resolves only from the pack it belongs to — so the pack list reads in the player's language, and the template's `texts/en_US.lang` files hold nothing but a comment pointing back at `packs/data/i18n/`.

The BP also declares a dependency on `@minecraft/server` and `@minecraft/server-ui`, and on the [render pack](/docs/ui/guides/render-pack) by its fixed UUID — already wired in, not something you add later.

### Identifiers

Two of your answers become Minecraft-safe identifiers — lowercased, non-alphanumerics collapsed to `_`:

| Variable | From | Used for |
| --- | --- | --- |
| `CREATOR_ID` | Author name | `core.register({ manifest: { creator } })`, the addon namespace |
| `PACK_ID` | Project name | `core.register({ manifest: { pack } })`, generated identifiers |

Together they form the addon namespace `<creator>_<pack>` that the [i18n filter derives](/docs/i18n/authoring#namespacing) for `.lang` keys and that the `guides` filter takes as its `namespace` setting.

### The generated `main.ts`

```ts
const { config } = core.register({
  manifest: {
    creator: 'your_name',
    pack: 'my_addon',
    packName: i18n.key($ => $.meta.name),
    creatorName: i18n.key($ => $.meta.creator),
    version: '1.0.0',
    description: i18n.key($ => $.meta.description),
  },
  catalog: registerCatalog(),
  config: registerConfig(configDef),
  guides: registerGuides(),
});
```

Display fields are **i18n keys**, not literals — that is what lets a catalog render your addon's name in each player's own language. `core.register()` publishes them to the [registry](/docs/server/api/registry) and, on the first tick, the bundle they resolve from. The three app fields register `<ns>:catalog`, `<ns>:config` and `<ns>:guide` under your namespace and serve the show methods another realm asks on; nothing runs after the call.

A `playerSpawn` handler greets the player with an interpolated translation (gated on a config value), and a `buttonPush` handler renders the Home screen — push a stone button in-game to see it, then follow its navigation to the plan screen and the profile form.

## After scaffolding

The CLI **does not** install anything. It copies the template, substitutes your answers, and downloads the latest render pack `.mcpack` from GitHub releases into the project root (non-fatal if that fails — it prints the download link instead).

It then prints:

```txt
✔ Project created successfully!

Next steps:

  cd my-addon
  yarn install (or npm install)
  yarn run regolith-install (or npm run regolith-install)
  yarn run build (or npm run build)
  The first build writes the Minecraft document types, so the .ts templates in
  packs/BP/blocks and packs/BP/entities autocomplete once it has run.
  See packs/BP/scripts/UI/screens/ to explore the starter screens and navigation.

Render pack:

  Install: open "./core-ui-v<version>.mcpack" (double-click to import into Minecraft)

Development:

  yarn run watch - Watch mode for auto-rebuild
  yarn run lint - Lint your code

Push a stone button in-game to see the example UI!
```

When the render pack download fails, the last line under "Render pack:" is replaced with a link to the latest `.mcpack` on GitHub Releases instead of a filename — non-fatal, so scaffolding still finishes.

| Script | What it runs |
| --- | --- |
| `regolith-install` | `regolith install-all` — fetches every filter declared in `config.json` |
| `build` | `regolith run build` — the read-only local export profile |
| `build:test` | `regolith run build-test` — the read-only gametest export, for `bds-runner` |
| `watch` | `regolith watch` — the development profile, redeploying on change |
| `watch:test` | `regolith watch test` — the development profile, resolving the gametest manifest and entry |
| `lint` | `eslint .` |
| `loopback` / `loopback:preview` | Windows loopback exemption for the Minecraft debugger |

No git repository is created and no package manager is detected — the template ships a `yarn.lock`, so `yarn install` is the smoothest path.

:::tip Prerequisites
Node.js 22.18+ (what the Regolith filters run on), a package manager, and [Regolith](https://regolith-docs.readthedocs.io/en/stable) on your `PATH`. See [Installation](/docs/ui/installation).
:::

## Next steps


- [Render pack](/docs/ui/guides/render-pack) — what the `.mcpack` is and how versioning works
- [i18n](/docs/i18n) — the translations the template already wires up
- [catalog](/docs/catalog) — the addon browser the template installs
- [config](/docs/config) — the settings app the template installs
- [guides](/docs/guides) — the in-game guide the template seeds
- [ore-styled](/docs/ore-styled) — the components the starter screens use
- [server-runtime](/docs/server/api/runtime) — the `core.register()` half of the generated `main.ts`
