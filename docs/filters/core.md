---
sidebar_position: 2
description: "One filter that runs the whole stack in dependency order, with the namespace declared once."
---
# core

One filter that runs the whole stack in the order the filters depend on, with the namespace declared once.

| # | Stage | Why here |
| --- | --- | --- |
| 1 | [`manifest`](./manifest.md) | picks the profile's manifest variant before anything reads it |
| 2 | [`generator`](./generator.md) | opt-in: templates become JSON before the scripts are bundled |
| 3 | [`guides`](./guides.md) | guide keys have to land before i18n collects them |
| 4 | [`i18n`](./i18n.md) | `.lang` files, the runtime bundle and the key types |
| 5 | [`ui-compiler`](./ui-compiler.md) | screens bake against the keys i18n emitted |
| 6 | [`bundler`](./bundler.md) | last: it inlines the generated bundles and strips the sources |

Each stage runs in its own Node process, exactly as Regolith runs it: same temp workspace, same `ROOT_DIR`, same settings JSON, same exit code. A stage whose inputs are absent says it has nothing to do and the run continues, so the full stack is a safe default for a project that uses part of it. A project that needs a step of its own between two stages lists the filters one by one in `config.json` and puts its own filter where it belongs.

## Install

Register the resolver once per machine, then install the whole set — `core` runs the other filters from their own folders, so it cannot be installed alone:

```bash
regolith config resolvers --append github.com/bedrock-core/regolith-filters/resolver.json
regolith install core manifest generator guides i18n ui-compiler bundler
```

Declare those same seven names in `regolith.filterDefinitions` with their released versions.
`regolith install-all` reads only that object; it does not follow `core`'s chain. The
[CLI template](/docs/cli) is a complete pinned example.

Then one entry per profile replaces the six:

```jsonc title="config.json"
{
  "regolith": {
    "profiles": {
      "default": {
        "filters": [
          {
            "filter": "core",
            "settings": {
              "shared": { "namespace": "drav0011_economy" },
              "ui-compiler": { "screens": ["./BP/scripts/screens/index.ts"] },
              "bundler": { "debug": true }
            }
          }
        ]
      },
      "test": {
        "filters": [
          {
            "filter": "core",
            "settings": {
              "shared": { "namespace": "drav0011_economy" },
              "manifest": { "manifestPath": "BP/manifest.test.json" },
              "ui-compiler": { "screens": ["./BP/scripts/screens/index.ts"] },
              "bundler": { "debug": true, "tsConfigPath": "tsconfig.test.json" }
            }
          }
        ]
      }
    }
  }
}
```

## Settings

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `shared` | `object` | `{}` | Merged into every stage. The addon's `namespace` belongs here, and so does `pretty`: absent, every file the stack generates is minified; `{ "indent": "tab" }` lays them all out. A stage that does not read a key ignores it |
| `manifest`, `guides`, `i18n`, `ui-compiler`, `bundler` | `object \| false` | `{}` | Settings for that stage, merged over `shared`. `false` skips the stage |
| `generator` | `object \| true` | off | The generator runs only when this key is present — it writes schema types into the project, so a project opts in. `true` runs it with defaults |

Each stage's own settings are documented on its page; the keys are unchanged here.

## Checks

| Check | What fails |
| --- | --- |
| Unknown setting | A key that is not `shared` or one of the six stage names |
| Missing stage | A stage whose folder is not installed beside `core` |
