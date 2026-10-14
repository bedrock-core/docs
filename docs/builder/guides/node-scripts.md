---
sidebar_position: 6
description: "Run standalone Node scripts with temporary pack folders, JSON settings and explicit targets."
---
# Node scripts

Script plugins run a Node entry against real temporary `BP`, `RP` and `data` folders. They can add, modify and delete files in place; successful pack edits return to the staged build before the next operation. [How builds run](./build-process.md) shows where these folders fit into the pipeline.

## Define the entry

```json
{
  "plugins": {
    "textures": {
      "script": "./index.js",
      "targets": "resource",
      "filterDir": "./node_modules/example-plugin"
    }
  }
}
```

`script` resolves relative to `filterDir`. Without `filterDir`, the project root is used. An absolute script path is also accepted.

Invoke the plugin by name in `steps`, with optional `settings` and `arguments`. Settings are passed directly to the script; no wrapper plugin is required.

```json
{
  "plugin": "textures",
  "before": "export",
  "settings": { "namespace": "example_assets" },
  "arguments": ["extra-argument"]
}
```

## Script options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `script` | `string` | — | Required Node entry file relative to filterDir |
| `filterDir` | `string` | Project root | Definition directory relative to config.json, exposed as FILTER_DIR |
| `targets` | `"resource" \| "behavior" \| "both" \| PackSelector` | — | Invoke separately for every matching pack |
| `packs` | `{ BP?: string; RP?: string }` | Automatic pair | Configured pack IDs to expose together; mutually exclusive with targets |
| `dataPath` | `string` | Existing `./data`, otherwise empty | Authored directory copied into the shared temporary data folder |
| `nodeArguments` | `string[]` | `[]` | Node flags placed before the script entry |

Step `settings`, when nonempty, become JSON at `process.argv[2]`. Additional `arguments` follow. With empty or omitted settings, arguments start at `process.argv[2]`.

## Packs and data

With `targets`, each invocation exposes its current pack as `BP` or `RP`; the other folder is empty. Successful edits return to that same staged pack. `"both"` processes packs separately, with one invocation per pack.

Without targets, manifests select at most one behavior pack and one resource pack. In a project with several packs of either type, use `targets` for separate invocations or select a pair with an explicit `packs` map, such as `{ "BP": "gameplay", "RP": "assets" }`. A script's fixed BP/RP folder names describe this selected view; configured pack IDs and source directories can have any names. Writing pack files into an unselected empty folder fails.

Node scripts share one staged `data` directory for the build. Select `dataPath` on the first invoked definition; later definitions can inherit it or repeat the same path. Data changes reach later scripts, and authored data is preserved.

## Environment and execution

| Variable | Value |
| --- | --- |
| `ROOT_DIR` | Authored project directory |
| `FILTER_DIR` | Definition directory |
| `PACK_ID` | Current configured ID for targeted invocations |
| `PACK_TYPE` | `behavior` or `resource` for targeted invocations |

The process working directory contains the temporary folders. Dependencies resolve from the script's location; scripts that need their own files should use `FILTER_DIR`, their module URL or `__dirname`.

Each invocation runs in a separate Node process. A nonzero exit fails the build. Cancellation stops the process before workspace cleanup.

## Example

Run a local script after the temporary project copy is prepared:

```json title="config.json"
{
  "targetVersion": "1.26.50",
  "namespace": "example",
  "name": "Example",
  "authors": ["Example"],
  "packs": { "gameplay": "./packs/BP", "assets": "./packs/RP" },
  "bedrockCore": {
    "formatVersion": "1.0.0",
    "plugins": {
      "textures": { "script": "./plugins/textures.cjs", "dataPath": "./data" }
    },
    "profiles": {
      "default": {
        "steps": [{ "plugin": "textures", "after": "prepare", "settings": { "quality": 80 } }],
        "export": { "gameplay": "./build/BP", "assets": "./build/RP" }
      }
    }
  }
}
```

Omitting `targets` and `packs` gives the script an automatically selected BP/RP pair. For several packs of either type, use [per-pack targets](./plugins.md#pack-selection-and-scope) or an explicit pair. Place the step at the boundary where the script's inputs are ready; steps at the same boundary retain array order.

Script code can continue using its folder paths and settings arguments. If it reads `ROOT_DIR/config.json`, supply the project metadata it expects. Temporary data edits are available to later script invocations in the build.

## Next steps

- [Plugins](./plugins.md) — module plugins with builder context
- [Configuration](./configuration.md) — pack IDs and destinations
- [Watch and cache](./watch.md) — register additional script inputs
