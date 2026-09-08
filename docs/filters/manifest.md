---
sidebar_position: 3
description: "Picks the profile's manifest variant and resolves its extends chain into manifest.json."
---
# manifest

One committed manifest per build shape, and the profile picks. `manifest.json` is what ships; `manifest.test.json` extends it and adds the beta modules the gametest build needs. `extends` works the way `tsconfig.json` does.

## Install

```bash
regolith install manifest
```

It runs first, before anything reads the manifest:

```jsonc title="config.json"
{
  "regolith": {
    "profiles": {
      "default": {
        "filters": [{ "filter": "manifest" }, { "filter": "bundler" }]
      },
      "test": {
        "filters": [
          { "filter": "manifest", "settings": { "manifestPath": "BP/manifest.test.json" } },
          { "filter": "bundler", "settings": { "tsConfigPath": "tsconfig.test.json" } }
        ]
      }
    }
  }
}
```

The profile picks a manifest the same way it picks an entry point. Nothing else changes.

## Authoring

```text
packs/BP/manifest.json        what ships: stable modules only
packs/BP/manifest.test.json   extends it, adds @minecraft/server-gametest
```

```jsonc title="packs/BP/manifest.test.json"
{
  "extends": "./manifest.json",
  "header": { "name": "DEV pack" },
  "dependencies": [
    { "uuid": "5e0e2a5b-74e2-4dd6-9c11-8a4f3f6b2d90", "version": [0, 1, 0] },
    { "module_name": "@minecraft/server", "version": "2.9.0-beta" },
    { "module_name": "@minecraft/server-gametest", "version": "1.0.0-beta" }
  ]
}
```

The base stays release truth and variants add to it, so a filter that never ran, or ran wrong, gives you a broken test build — never a release with beta modules in it.

Merge rules are TypeScript's:

- Objects merge key by key, recursively. `header: { name }` overrides the name and keeps the uuid.
- Arrays and scalars replace outright. `dependencies` in the child becomes the whole list, so restating it is how a variant adds, re-versions or drops an entry.
- `extends` is a relative path resolved against the file that declares it, and chains as deep as you like: `manifest.test.json` extends `manifest.dev.json`, which extends `manifest.json`.

### More than one pack

A build shape that changes both manifests names both, in one array:

```jsonc title="config.json"
{
  "filter": "manifest",
  "settings": { "manifestPath": ["BP/manifest.test.json", "RP/manifest.test.json"] }
}
```

Each entry resolves independently and is written as `manifest.json` beside its own source. Variant filenames need not match across packs. To vary only one pack, name only that one; a manifest with no `extends` is a no-op to resolve.

Do not list the filter twice in a profile. Every run sweeps the variants in `BP/` and `RP/`, so the first run deletes what the second one was going to read. One entry, one array.

## What it generates

| Output | Where | Commit it? |
| --- | --- | --- |
| `manifest.json` | beside each resolved source, in the temp workspace | no — the committed file is the base |

After resolving, every `manifest.*.json` left in `BP/` and `RP/` is deleted from the temp workspace, both pack roots, whichever ones the profile named. `manifest.json` itself and files that merely look close (`manifest.json.bak`) are left alone. Nothing is written until every entry has resolved and validated, so a broken `extends` chain leaves the workspace as it was.

The filter edits nothing it was not asked to: no UUID generation, no script-module injection, no version stamping.

## Settings

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `manifestPath` | `string \| string[]` | `"BP/manifest.json"` | Manifest to resolve. An array resolves one per pack |

Paths are relative to Regolith's temp workspace; a leading `packs/` is stripped, so `packs/BP/manifest.test.json` and `BP/manifest.test.json` both work. The result is always written as `manifest.json` beside its source — Bedrock accepts no other name.
