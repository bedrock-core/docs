---
sidebar_position: 3
description: "Generate Minecraft JSON from typed TypeScript objects and reusable content variants."
---
# Generate JSON

The generator stage evaluates TypeScript content templates at build time and writes their results as Minecraft JSON.

Use it to get editor checks for content schemas, share constants and generate families of related files. Ordinary JSON files remain valid inputs and need no conversion.

## Generate one file

Create a TypeScript file in the pack's normal content directory:

```ts title="packs/gameplay/entities/training_dummy.entity.ts"
export default {
  'format_version': '1.21.0',
  'minecraft:entity': {
    description: {
      identifier: 'example:training_dummy',
      is_summonable: true,
      is_spawnable: false,
      is_experimental: false,
    },
    components: { 'minecraft:health': { value: 20, max: 20 } },
  },
} satisfies Entity;
```

Run your build command. The output contains `entities/training_dummy.entity.json`; the authored TypeScript remains in your project and is omitted from the exported pack.

The template executes in Node.js while building. Gameplay code that imports `@minecraft/server` belongs in the pack's script directory instead.

## Enable editor types

The first build generates content schema declarations. Include them in your TypeScript configuration:

```json title="tsconfig.json (include)"
{
  "include": [
    "packs/**/*.ts",
    ".bedrock-core/generated/**/*.d.ts"
  ]
}
```

Types such as `Entity`, `Block`, `Item` and `Recipe` describe Minecraft JSON. `satisfies` checks your object without changing the emitted JSON. The CLI starter includes the generated declarations already.

## Generate several variants

A template can export a tuple containing an output-name function, a content function and the values to generate:

```ts title="packs/gameplay/entities/dummies.entity.ts"
type Variant = { id: string; health: number };

export default [
  variant => `${variant.id}.json`,
  variant => ({
    'format_version': '1.21.0',
    'minecraft:entity': {
      description: {
        identifier: `example:${variant.id}`,
        is_summonable: true,
        is_spawnable: false,
        is_experimental: false,
      },
      components: { 'minecraft:health': { value: variant.health } },
    },
  }),
  [{ id: 'small_dummy', health: 10 }, { id: 'large_dummy', health: 100 }],
] satisfies Many<Variant, Entity>;
```

This writes `small_dummy.json` and `large_dummy.json` beside the template's location in the output pack. Output names are filenames, not paths into other directories.

## Share code and project metadata

Import TypeScript, JavaScript, JSON, installed npm packages or Node built-ins. Static imports participate in rebuild tracking. Named-only helper modules can live beside templates; they are not treated as JSON outputs. Consumed TypeScript helpers stay available to later compilers and are omitted from exported packs.

A default export can be JSON data, a promise of JSON data, or a zero-argument sync or async function returning it:

```ts title="packs/gameplay/config/settings.ts"
import { defaults } from '../../../src/defaults.ts';

export default async () => ({
  ...defaults,
  enabled: true,
});
```

The resolved output must serialize as JSON. Arrays and scalar values are supported; a tuple containing name and data functions generates several documents. Those callbacks can also be async.

Import `project` from `@bedrock-core/generated/project` for the configured name, namespace and package version. This lets several packs share project metadata without duplicating literal strings.

## Choose inputs

By default, generation finds TypeScript files with default exports inside packs, excluding script directories, declarations and inputs reserved by participating processors. Use `stages.generator.include` and `exclude` to narrow that selection. Set `stages.generator` to `false` for a profile that does not generate JSON.

Builder validates generated content after processing. TypeScript editor checks and Minecraft schema validation serve different purposes; keep both enabled.

## Next steps

- [Projects and packs](./projects.md) — place generated content in its owning pack
- [Configuration](./configuration.md) — configure a profile
- [Watch and cache](./watch.md) — rebuild after template and helper changes
