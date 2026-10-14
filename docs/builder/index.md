---
slug: /
sidebar_position: 1
sidebar_label: Overview
description: "Build Bedrock packs with automatic stages, Node plugins and explicit exports."
---
# builder

Build TypeScript and JavaScript Bedrock projects with named profiles, automatic stages and Node plugins.

:::caution Beta
`@bedrock-core/builder` has a prerelease API. Pin the package version used by a project.
:::

## What is @bedrock-core/builder?

Builder combines ordered stages with project-owned plugins. Each pack owns its sources and generated modules; manifest dependencies route client output to its linked resource pack. [Configuration](./guides/configuration.md) defines project metadata, pack IDs and export destinations.

Builder creates a temporary build folder on disk, copies project sources into it and runs the selected profile over those files. Stages and plugins modify the copied packs in order. Builder validates the final packs, exports each to its configured directory and removes the temporary folder. Authored pack files stay intact; a failed step prevents the whole build from being published. [How builds run](./guides/build-process.md) explains the workspace and execution sequence.

## Install

Use Node 22.18 or newer and install the builder as a development dependency:

<Install pkg="@bedrock-core/builder@next" dev />

The executable is `bc-builder`. Plugin dependencies belong in the project's package manifest and lockfile.

## What you get

- **Automatic stages** — manifest variants, JSON templates, guides, translations, UI compilation and script bundling participate when their inputs exist
- **Named profiles** — select stage settings, ordered plugin steps and pack destinations for each build
- **Node plugins** — run a module with shared build services or a standalone script with temporary `BP`, `RP` and `data` folders
- **Explicit exports** — map arbitrary pack IDs to local, Minecraft development or server directories
- **Verified reuse** — unchanged compilations and JSON checks can be reused during builds and serial watch rebuilds

The [API](./api/index.md) provides programmatic builds and independently usable stage functions.

## Next steps

- [Build a pack](./guides/quick-start.md) — the smallest resource-pack project
- [Migrate from Regolith](./guides/migration.md) — preview configuration conversion and validate migrated packs
- [How builds run](./guides/build-process.md) — temporary files, plugin execution and export
- [Configuration](./guides/configuration.md) — metadata, profiles, pack IDs and exports
- [Plugins](./guides/plugins.md) — module definitions, script entries and per-pack targets
- [Stages](./guides/stages.md) — built-in order, discovery and standalone packages
