---
sidebar_position: 4
description: "Write Minecraft JSON as TypeScript templates typed against Mojang's official schemas."
---
# generator

Write Minecraft JSON as TypeScript. The filter finds `.ts` files in your packs, runs them, and writes the JSON next to them — one file, or many from a list. Templates are checked against Mojang's official JSON Schemas as you type.

## Install

```bash
regolith install generator
```

```jsonc title="config.json"
{
  "regolith": {
    "profiles": {
      "build": {
        "filters": [{ "filter": "generator" }, { "filter": "bundler" }]
      }
    }
  }
}
```

It is not part of the default [`core`](./core.md) stack, because it emits schema types into the project; add it to `stages` before the bundler. Then add the generated types to `tsconfig.json`:

```jsonc title="tsconfig.json"
{
  "include": [
    "packs/data/generated/mc/globals.d.ts",
    "packs/BP/**/*.ts",
    "packs/RP/**/*.ts"
  ]
}
```

Run the build once — the types are written on the first run.

## Authoring

### One file

A default-exported object becomes one `.json` with the same basename — `training_dummy.entity.ts` writes `training_dummy.entity.json` beside it. `satisfies Entity` is what gives you autocompletion; it is erased at build time, so nothing reaches the runtime.

```ts title="BP/entities/training_dummy.entity.ts"
export default {
  format_version: '1.21.0',
  'minecraft:entity': {
    description: { identifier: 'example:training_dummy', is_summonable: true },
    components: {
      'minecraft:health': { value: 20, max: 20 },
      'minecraft:physics': {},
    },
  },
} satisfies Entity;
```

### Many files

Default-export `[nameFn, dataFn, items]` — `ores.ts` below writes `ruby_ore.json` and `sapphire_ore.json`. `nameFn` returns a basename (`.json` is added if missing); both callbacks may be `async`.

```ts title="BP/blocks/ores.ts"
type Options = { id: string; mapColor: string; light?: number };

export default [
  (o) => `${o.id}.json`,
  (o) => ({
    format_version: '1.21.0',
    'minecraft:block': {
      description: { identifier: `example:${o.id}` },
      components: {
        'minecraft:map_color': o.mapColor,
        'minecraft:light_emission': o.light ?? 0,
      },
    },
  }),
  [
    { id: 'ruby_ore', mapColor: '#c0392b' },
    { id: 'sapphire_ore', mapColor: '#2980b9', light: 7 },
  ],
] satisfies Many<Options, Block>;
```

Naming `Options` once in the `satisfies` types both callbacks, so `o` needs no annotation.

### The type names

One global per document category, no import needed. Press Ctrl+Space after `satisfies ` to browse all 39:

`Block` `Entity` `Item` `Biome` `Feature` `FeatureRule` `LootTable` `Recipe` `SpawnRule` `Trading` `Dialogue` `AnimationController` `VoxelShape` `Tick` `Model` `Fog` `Particle` `Attachable` `RenderController` `Sound` `BlocksResource` `TerrainTexture` `ItemTexture` `FlipbookTexture` `BlockCulling` `Ui` `GlobalVariable` `TextureSet` `Language` `MusicDefinition` `Lighting` `ColorGrading` `Atmospheric` `Pbr` `PointLight` `Shadow` `Water`

Two carry a pack prefix because the plain name was taken: `BpAnimation` (TypeScript's DOM lib defines `Animation`) and `RpEntity`. If any of these clash with your own globals, set `typePrefix` — `"Mc"` gives `McBlock`, `McEntity`, and so on.

### Rules

- Templates live anywhere under BP/RP, at any depth. `BP/entities/mobs/hostile/zombie.ts` works; its JSON is written beside it. The type comes from `satisfies`, never from the folder.
- `BP/scripts/**` and `**/*.d.ts` are skipped.
- No `import` or `require` at runtime — templates are evaluated in a sandbox. `import type` is fine (esbuild erases it), so you can pull in type names directly: `import type { BlockBehaviorDocument } from '../../data/generated/mc'`.
- Pack folders come from `config.json` (`packs.behaviorPack` / `packs.resourcePack`), defaulting to `BP` and `RP`.

## What it generates

| Output | Where | Commit it? |
| --- | --- | --- |
| One `.json` per template, or per item of a `Many` list | beside the template, in the temp workspace | no |
| `globals.d.ts` and the schema `.d.ts` files | `<dataPath>/generated/mc` in the real project | either — they never ship, and they are rewritten when the schema version changes |

The filter downloads [`@minecraft/bedrock-schemas`](https://www.npmjs.com/package/@minecraft/bedrock-schemas), caches it under `.regolith/cache/generator/`, and compiles it into `.d.ts` files, skipped when the cached version already matches. Then it scans for templates, transpiles each with esbuild, evaluates it in a sandboxed VM, and writes the JSON. The types land in the real project because the IDE is what reads them.

The schemas trail the game by a version or two, so `strict` is off by default. Where a schema carries no usable information — a few components are published as a bare `{"type": "object"}`, and entity `description` is undescribed — the type is `unknown` rather than an invented shape, so valid templates never produce false errors. Component names autocomplete everywhere; some values are unconstrained.

## Settings

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `include` | `string \| string[]` | `["BP/**/*.ts", "RP/**/*.ts"]` | Globs to scan |
| `exclude` | `string \| string[]` | `["BP/scripts/**", "**/*.d.ts"]` | Globs to skip |
| `pretty` | `boolean` | `true` | Indent the output JSON |
| `types` | `boolean` | `true` | Generate the Minecraft types. `false` skips the download entirely |
| `schemaVersion` | `string` | `"latest"` | Dist-tag (`latest`, `beta`) or exact version. Pin it for reproducible builds |
| `typesDir` | `string` | `<dataPath>/generated/mc` | Where the types land, relative to the project root |
| `typePrefix` | `string` | `""` | Prefix for the global aliases |
| `strict` | `boolean` | `false` | Reject properties the schema does not declare |
| `maxAgeHours` | `number` | `24` | Registry metadata cache lifetime. Only used for dist-tags |

## Checks

| Message | Fix |
| --- | --- |
| `ROOT_DIR environment variable not set` | Run through Regolith; the filter needs its environment |
| `No .ts templates found` | Templates must be under BP/RP and not in `BP/scripts/` |
| `Imports are not allowed in template files` | Drop the `import` / `require`, or make it `import type` |
| `Invalid default export array` | The tuple must be exactly `[nameFn, dataFn, items]` |
| `Invalid filename` | `nameFn` must return a non-empty basename, no directories |
| `Cannot find name 'Block'` | `tsconfig.json` `include` is missing `packs/data/generated/mc/globals.d.ts`, or the build has not run yet |
| Types look stale | Bump `schemaVersion`, or delete `packs/data/generated/mc/` |
