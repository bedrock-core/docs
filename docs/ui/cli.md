---
sidebar_position: 9
---

# CLI

`@bedrock-core/cli` scaffolds a complete Minecraft Bedrock addon project — Regolith build, TypeScript, ESLint, the full bedrock-core stack, and a working example screen — in one command.

```bash
npx @bedrock-core/cli
```

## Usage

```bash
npx @bedrock-core/cli [project-name]
```

| Argument | Required | Description |
| --- | --- | --- |
| `[project-name]` | no | The project directory. Passing it skips the first prompt |

| Flag | Description |
| --- | --- |
| `-V, --version` | Print the CLI version |
| `-h, --help` | Print usage |

There are no other flags — no template switch, no `--yes`, no package-manager choice.

### Prompts

Three text prompts, all with defaults you can accept with Enter:

| Prompt | Default | Validation |
| --- | --- | --- |
| `Project name:` | `my-addon` | Must be a valid new npm package name (this becomes the directory and `package.json` name) |
| `Author name:` | `Your Name` | — |
| `Description:` | `A Minecraft Bedrock addon with custom UI` | — |

Ctrl-C prints `✖ Operation cancelled` and exits cleanly. The CLI refuses to write into a directory that already exists and is not empty.


## What gets scaffolded

The template scaffolds the **whole bedrock-core stack**, not just a UI: [server runtime](/docs/server/server-runtime) registration, the shared config UI, typed translations, MDX guides, JSON generation from TypeScript, and a themed example screen with navigation and a modal form.

```txt
my-addon/
├── config.json                       Regolith: generator → guides → i18n → bundler
├── package.json                      scripts: regolith-install / build / watch / lint
├── tsconfig.json                     JSX + the two @bedrock-core/generated aliases
├── eslint.config.mjs
├── .vscode/                          launch.json wired to the Minecraft debugger (port 19144)
├── core-ui-v*.mcpack                 render pack, downloaded for you
└── packs/
    ├── BP/
    │   ├── manifest.json
    │   ├── blocks/tutorial.block.ts          generator sample — one file, many blocks
    │   ├── entities/training_dummy.entity.ts generator sample — single file
    │   ├── texts/{en_US.lang, languages.json}
    │   └── scripts/
    │       ├── main.ts                       core.register(...) + ui(core) + events
    │       ├── config.ts                     typed config schema
    │       └── UI/
    │           ├── Example.tsx               ore-styled screens + stack navigation + Form
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

`config.json` defines four filters, in this order, in both the `build` and `default` profiles:

| Order | Filter | What it does |
| --- | --- | --- |
| 1 | `generator` | Transpiles `.ts` templates in `BP/`/`RP/` into JSON (blocks, entities), and generates Minecraft document types |
| 2 | [`guides`](./guides/regolith-filter.md) | Compiles `data/guides/<locale>/**.mdx` into a manifest + `.lang` |
| 3 | [`i18n`](./i18n/regolith-filter.md) | Compiles `data/i18n/<locale>.ts` into `.lang`, the runtime bundle, and types |
| 4 | `bundler` | Bundles `BP/scripts/` into one `main.js` with esbuild |

The order matters: `guides` writes its `.lang` section before `i18n` picks it up as measurement passthrough, and `i18n` must write its bundle before the bundler inlines it. See [the i18n filter page](./i18n/regolith-filter.md#coexisting-with-the-guides-filter).

Templates are checked against Mojang's official JSON Schemas. The `generator`
filter writes document types into `packs/data/generated/mc/`, so a template is a
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

The two profiles differ only in build flags: `default` (used by `regolith watch`) exports to `development` with `pretty` JSON and a debug bundle; `build` (used by `yarn build`) exports read-only to `local` with neither.

### tsconfig

```json
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
  "include": ["packs/BP/scripts/**/*", "packs/data/**/*"]
}
```

:::caution Build once before the editor is happy
Both generated files are produced by the filters, so a freshly scaffolded project does not typecheck until `yarn build` has run at least once. This is expected — run the build before hunting for missing modules.
:::

### Manifests

Five UUIDs are generated per project (`crypto.randomUUID()`), one per manifest header and module. The BP and RP depend on each other by UUID, both use `pack_scope: "world"` and `min_engine_version: [1, 26, 30]`, and neither bakes its name and description into the manifest: both headers point at `<creator>_<pack>.meta.name` / `.meta.description`, which you author once as `meta.*` in `packs/data/i18n/<locale>.ts`. The [i18n filter](./i18n/regolith-filter.md#manifest-display-strings) emits them into each pack's own `texts/<locale>.lang` — a manifest key resolves only from the pack it belongs to — so the pack list reads in the player's language, and the template's `texts/en_US.lang` files hold nothing but a comment pointing back at `packs/data/i18n/`.

The BP also declares a dependency on `@minecraft/server` and `@minecraft/server-ui`. Add the [render pack](./ui-runtime/render-pack.md) dependency when you ship.

### Identifiers

Two of your answers become Minecraft-safe identifiers — lowercased, non-alphanumerics collapsed to `_`:

| Variable | From | Used for |
| --- | --- | --- |
| `CREATOR_ID` | Author name | `core.register({ creator })`, the addon namespace |
| `PACK_ID` | Project name | `core.register({ pack })`, generated identifiers |

Together they form the addon namespace `<creator>_<pack>` that the [i18n filter derives](./i18n/regolith-filter.md#namespacing) for `.lang` keys and that the `guides` filter takes as its `namespace` setting.

### The generated `main.ts`

```ts
const config = core.register({
  creator: 'your_name',
  pack: 'my_addon',
  packName: i18n.key($ => $.meta.name),
  creatorName: i18n.key($ => $.meta.creator),
  version: '1.0.0',
  description: i18n.key($ => $.meta.description),
  translations: bundle,
  guide: guides,
  config: configDef,
});

ui(core);
```

Display fields are **i18n keys**, not literals — that is what lets the shared list render your addon's name in each player's own language. `core.register()` publishes them to the [server-side registry](/docs/server/server-runtime/registry); `ui(core)` mounts the [shared config UI](./config/config.md) and registers the four `<ns>:…` commands.

A `playerSpawn` handler greets the player with an interpolated translation (gated on a config value), and a `buttonPush` handler renders the example screen — push a stone button in-game to see it.

## After scaffolding

The CLI **does not** install anything. It copies the template, substitutes your answers, and downloads the latest render pack `.mcpack` from GitHub releases into the project root (non-fatal if that fails — it prints the download link instead).

It then prints:

```txt
Next steps:

  cd my-addon
  yarn install (or npm install)
  yarn run regolith-install (or npm run regolith-install)
  yarn run build (or npm run build)
  See packs/BP/scripts/UI/Example.tsx to explore the starter screens and navigation.

Render pack:

  Install: open "./core-ui-v<version>.mcpack" (double-click to import into Minecraft)

Development:

  yarn run watch - Watch mode for auto-rebuild
  yarn run lint - Lint your code

Push a stone button in-game to see the example UI!
```

| Script | What it runs |
| --- | --- |
| `regolith-install` | `regolith install-all` — fetches the four filters |
| `build` | `regolith run build` — the read-only local export profile |
| `watch` | `regolith watch` — the development profile, redeploying on change |
| `lint` | `eslint .` |
| `loopback` / `loopback:preview` | Windows loopback exemption for the Minecraft debugger |

No git repository is created and no package manager is detected — the template ships a `yarn.lock`, so `yarn install` is the smoothest path.

:::tip Prerequisites
Node.js 20+, a package manager, and [Regolith](https://regolith-docs.readthedocs.io/en/stable) on your `PATH`. See [Installation](./get-started/installation.md).
:::

## Next steps

- [Render pack](./ui-runtime/render-pack.md) — what the `.mcpack` is and how versioning works
- [i18n](./i18n/i18n.md) — the translations the template already wires up
- [config](./config/config.md) — the settings UI `ui(core)` mounts
- [guides](./guides/guides.md) — the in-game guide the template seeds
- [ore-styled](./ore-styled/ore-styled.md) — the components `Example.tsx` uses
- [server-runtime](/docs/server/server-runtime) — the `core.register()` half of the generated `main.ts`, and [how the two sides meet](/docs/server/ui-integration)
