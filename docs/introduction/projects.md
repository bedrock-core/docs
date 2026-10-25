---
sidebar_position: 2
description: "Distinguish a JavaScript project, a Minecraft pack and an addon."
---
# Projects, packs and addons

A project organizes source code and build tools; Minecraft loads the packs produced by that project.

| Term | Meaning |
| --- | --- |
| Project | One JavaScript or TypeScript project, with dependencies, build configuration and one or more source packs |
| Pack | A directory with a Minecraft manifest; its modules declare what it contains |
| Addon | Content delivered together for players, which can span several packs |

A project can produce one pack, several packs belonging to one addon, or several independent addons. It does not require a behavior/resource pair.

## Choose the packs your content needs

- A texture project can contain one resource pack.
- A gameplay script can live in one behavior pack.
- Custom gameplay with its own textures can use a behavior pack and a resource pack.
- A larger project can contain several scripted packs, content packs and resource packs.

Pack IDs in Builder are names you choose, such as `gameplay`, `shop` or `textures`. The manifest's module types identify the pack; neither its ID nor its folder name assigns that type.

## Share source without sharing a realm

Packs in a project can import shared TypeScript helpers while building. Their output still runs under Minecraft's pack boundaries. Two behavior packs do not share live variables because they came from the same project.

Use [server](/docs/server) when those packs need to discover each other or exchange runtime data.

## Next steps

- [Configure multiple packs](/docs/builder/guides/projects) — map pack IDs, dependencies and outputs
- [Create a project](/docs/cli) — start with the smallest suitable preset
