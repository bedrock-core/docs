---
sidebar_position: 9
description: "Run existing Node filters with BP/RP folder mappings and independent data sources."
---
# Node scripts

Run an existing Regolith-style JavaScript entry against selected packs. Prefer [plugins](./plugins.md) for new processing.

## Map its folders

A script sees temporary `BP`, `RP` and `data` folders. Map conventional pack folders to your configured pack IDs:

```json
{
  "plugins": {
    "clean": {
      "script": "./filters/json-cleaner/main.js",
      "folders": { "BP": "gameplay", "RP": "textures" }
    }
  },
  "profiles": {
    "build": {
      "steps": [{
        "plugin": "clean",
        "before": "export",
        "settings": { "minify": true }
      }]
    }
  }
}
```

These fields belong under `bedrockCore`. `gameplay` supplies the contents of `BP/`; `textures` supplies `RP/`. Authored directory names do not matter. The selected manifests must identify a behavior pack for `BP` and a resource pack for `RP`.

Omit `folders` only when the project has an unambiguous set: at most one behavior pack and one resource pack. Each step runs once. To process another set, invoke the same script again with a step-level `folders` map. That map replaces the definition's mapping.

An omitted role becomes an empty folder. Writing pack output into an unmapped role fails. Use `folders: {}` for a step that only processes data. Packs remain separate; the adapter does not combine several packs into one conventional folder.

## Supply data

Set `dataPath` to an existing project-relative directory containing the filter's inputs. Omission uses project-root `data/` when present, otherwise an empty working copy. Preserve any subfolders the filter expects, such as `data/simple_blocks/config.json`.

Steps using the same resolved source path share its temporary working copy. Different data sources stay independent, so separate addons can use their own inputs. A step can override `dataPath`. Each build starts from authored data.

Temporary data is omitted from pack exports. Write Minecraft content through the mapped pack folders.

## Persist data explicitly

Set `persistData: true` alongside an explicit `dataPath` to save that source's working data after a successful build:

```json
{
  "script": "./filters/counter/main.js",
  "folders": {},
  "dataPath": "./filter-data/counter",
  "persistData": true
}
```

The source must be an existing dedicated directory outside packs, export destinations and project internals. Persistent data sources cannot overlap other selected data sources. Persistence applies to the complete working copy shared by steps using that source.

Builder validates pack output before publication, locks opted-in data destinations and restores their previous contents if pack publication fails. Concurrent edits are detected; conflicts during rollback retain a backup for recovery. Watch mode observes authored data edits without rebuilding for its own successful writeback. With `persistData` omitted or false, authored data remains unchanged.

## Install and invoke the script

Install the filter's dependencies beside its entry as its author specifies. The adapter starts Node; it does not download filters, install requirements or execute other filter runtimes.

A nonempty `settings` object is the first JSON-encoded argument. A step's `arguments` follow it. `filterDir` changes the base for the script path and supplies `FILTER_DIR`; `nodeArguments` places Node flags before the entry. `ROOT_DIR` points to the original project.

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `script` | `string` | — | Node entry relative to `filterDir` |
| `folders` | `{ BP?: string; RP?: string }` | Infer one unambiguous set | Conventional folders mapped to pack IDs |
| `dataPath` | `string` | `./data` or empty input | Authored data source |
| `persistData` | `boolean` | `false` | Save this source's working data after successful publication |
| `filterDir` | `string` | Project root | Definition directory and script path base |
| `nodeArguments` | `string[]` | `[]` | Node flags before the entry |

`folders`, `dataPath` and `persistData` can also be set on a script step. Native plugin steps use their own pack-selection settings.

## Build behavior

Scripts execute on each build. Pack edits return to staging after successful execution; failures and cancellation preserve previous exports. Registered script directories and data inputs participate in watch rebuilding.

Filters that read Regolith configuration, assume authored `packs/BP` paths, launch external tools or write through `ROOT_DIR` need individual compatibility checks. Folder mapping preserves the temporary folder convention; it does not rewrite script code or project configuration.

## Next steps

- [Plugins](./plugins.md) — write an extension with pack-aware services
- [Projects and packs](./projects.md) — configure arbitrary pack layouts
- [Configuration](./configuration.md) — define profiles and exports
