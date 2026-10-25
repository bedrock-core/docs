---
slug: /
sidebar_position: 1
sidebar_label: What is @bedrock-core?
description: "Build Minecraft Bedrock packs with TypeScript and connect addons through shared runtime libraries."
---
# What is @bedrock-core?

@bedrock-core is a set of tools and libraries for creating Minecraft Bedrock content with JavaScript and TypeScript.

Use the build tools for a resource pack, a behavior pack, or a project containing many packs. Add the runtime libraries when your content needs cross-addon communication, persistent data or custom interfaces. Each part can be used independently.

## Build your packs

[Builder](/docs/builder) turns authored files into Minecraft packs. It bundles scripts, generates JSON from TypeScript, compiles translations and guides, and exports the completed packs. Watch mode rebuilds after changes and reuses results whose inputs are unchanged.

The [CLI](/docs/cli) creates a project with the build commands and example files already connected. Choose a resource-only project, a scripting project or the full framework starter.

## Connect addons

Minecraft runs each scripted behavior pack in its own JavaScript realm. Packs cannot share variables or import each other's runtime code.

[Server](/docs/server) supplies discovery, messages and shared state across those realms. [Observable](/docs/observable) provides reactive values; [db](/docs/db) stores persistent documents. These libraries also work without the UI packages.

## Add interfaces and content

[UI](/docs/ui) builds screens from JSX. [Navigation](/docs/navigation) connects pages; [ore-styled](/docs/ore-styled) provides Minecraft-styled components. [Config](/docs/config), [guides](/docs/guides) and [catalog](/docs/catalog) add ready-made application flows.

## Test the result

[BDS runner](/docs/bds-runner) runs GameTests on a headless Bedrock Dedicated Server and can optimize built packs for distribution.

## Next steps

- [Projects, packs and addons](./projects.md) — understand how the pieces fit together
- [Create a project](/docs/cli) — choose a starter and run its first build
- [Build a pack](/docs/builder/guides/quick-start) — add Builder to an existing folder
