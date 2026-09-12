---
sidebar_position: 1
sidebar_label: Overview
description: "How a screen's JSX becomes the static JSON UI a host serves, and what the build guarantees about it."
---
# Compiler

Every screen is compiled. `@bedrock-core/ui-compiler` turns a screen component into the static JSON UI that ships in the resource pack, and the [`ui-compiler` filter](/docs/filters/ui-compiler) is what runs it over a project.

Nothing in the compiler reaches the game. It has no `@minecraft/server` calls and no components of its own: it renders a screen once on the build machine and writes a document the client already holds by the time anybody opens it. What crosses at runtime is the screen's title and the values that changed.

## How a screen is compiled

Four steps, each a pure function of the last.

| Step | Takes | Gives |
| --- | --- | --- |
| Build | the screen component | one built element tree, rendered under the build's own owner so its hooks resolve |
| Lower | that tree, laid out against the host's canvas | the IR: one node per control, each with its rect, its static props and the mechanism it needs |
| Face | the IR | the face document — every control as its look alone, with no bindings at all |
| Fill | the face document plus a host | the screen document the host serves |

Layout is solved once, at build, by [`@bedrock-core/flexbox`](/docs/flexbox) against a fixed 320 × 210 canvas. No geometry is measured in game and no layout is sent to the client.

Which host a screen compiles for is decided by its root element, and there is no default — `<Screen>` is an action form, `<Form>` a native modal, `<Container>` a chest screen. What differs between them is in [Hosts](../guides/hosts.md).

## What you get

**One geometry** — the layout pass owns every `size`, `offset`, `anchor_from` and `anchor_to`, and the host pass is diffed against it after it emits. A host can replace what a control is; it can never move it, so a mechanism cannot quietly break a layout that was signed off.

**A capability model with names** — each host declares what every kind of component becomes on it. A `<Form.Slider>` outside a `<Form>`, a `<Slot>` outside a container screen: refused at build, by name, in that host's own words, instead of drawn inert.

**A drawable document with no host behind it** — the face pass produces a complete screen on its own. That is what the static rules run over, what the [gallery](/docs/filters/ui-compiler#the-gallery) shows, and why nothing hidden can evaluate a binding that is not there.

**A frozen shape** — a compiled screen cannot add or drop a control at runtime. Everything that varies says so in the source: [`<List max>`](../components/List.md) for a count, [`maxLength`](../components/Text.md) for a string, `visible` for a branch. A render that drifts from what the build measured is reported by `render(screen, player, { debug: true })` rather than silently drawn wrong.

## Next steps

- [Faces and hosts](./passes.md) — the two passes, the three layers, and the behaviors a primitive carries
- [`@bedrock-core/ui-compiler`](./api.md) — the programmatic entry points, for tooling rather than for addons
- [Hosts](../guides/hosts.md) — the three screens the library draws on, and what each can carry
- [`ui-compiler` filter](/docs/filters/ui-compiler) — running the compiler over a project
