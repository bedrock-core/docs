---
sidebar_position: 6
description: "@bedrock-core/ui-compiler: the entry points the ui-compiler filter calls, and the limits the compiled model imposes."
---
# @bedrock-core/ui-compiler

The build-time library the [`ui-compiler` filter](/docs/filters/ui-compiler) runs: a screen component goes in, the JSON UI document a host serves comes out.

This page is for tooling. An addon never imports it — the filter does, and it bundles the compiler out of the **project's** `node_modules` rather than its own, so a screen is compiled by the version of the library the addon actually ships. An addon that compiles screens therefore depends on the compiler even though none of it reaches `main.js`.

The same holds for `@bedrock-core/ui-runtime`: the pipeline runs inside that bundle, so the filter cannot drift from the library. Every value the emitted JSON UI shares with the runtime — the character table, the layout property, the highest layout key — is read off it for the same reason.

## Import

```ts
import { compileFormScreen, compileScreen } from '@bedrock-core/ui-compiler';
```

The build half of the runtime is a subpath of its own, and supplies everything the compiler takes as input:

```ts
import { buildScreenOnce, hostFor, probeLiveness } from '@bedrock-core/ui-runtime/compile';
```

## Compiling one screen

```ts
compileScreen(Screen, { name, namespace? }): CompiledScreen
compileFormScreen(Screen, { name, namespace }): CompiledFormScreen
```

Both take the **component**, not the result of calling it: the compiler renders it under its own owner, which is what makes the hooks inside it resolve. `compileScreen` serves the chest; `compileFormScreen` serves the action form and the modal, deciding which from the root. Each probes for liveness before anything is baked and returns the served document, face document, compiled entries and allocation data the filter needs.

## Compiling an addon

```ts
buildRouter(screens)
formRouter(screens, addon): FormRouting
```

The addon-level documents: the hooks into vanilla files, and the router holding one gated definition per screen. One addon per call — a router covers one addon, and mixing two is an error.

## Exports

| Export | Kind | Description |
| --- | --- | --- |
| `compileScreen` | function | Compiles one container screen |
| `compileFormScreen` | function | Compiles one form screen, action or modal |
| `buildRouter` | function | The chest hooks and one addon's chest router |
| `formRouter` | function | The mount insert and one addon's form router |
| `toIr` | function | A built root plus a host's addressing, lowered to IR |
| `faceOf` | function | IR to a face document and the faces it shares |
| `fill` | function | A face document plus a host, to the served document |
| `emit` | function | `faceOf` then `fill`, for a caller that wants only the result |
| `facesNamespaceOf` | function | `<addon>_faces`, the namespace an addon's shared faces live in |
| `formRouterFileOf` | function | Pack path of an addon's form router |
| `CHEST_HOST` | const | The chest host: its hooks, canvas, collection and container type |
| `MOUNT_ANCHOR` | const | Where a compiled chest layout sits: centered both ways |
| `MOUNT_FILE` | const | Pack path of the form mount an addon inserts into |
| `SCREEN_DEFINITION` | const | Name of the definition the router mounts |
| `BACKDROP_DEFINITION` | const | Name of the full-screen image mounted behind it |
| `UnsupportedNodeError` | class | Thrown for a control with no compiled form |

The IR node types, the JSON UI control types, and the result shapes (`CompiledScreen`, `CompiledFormScreen`, `FaceDocument`, `ScreenSpec`, `FormScreenSpec`, `FormRouting`, `RoutedScreen`, `RoutedFormScreen`, `ToIrOptions`, `Allocation`) are exported as types beside them.

## Limits

Percentages, `%c` and anchors are not exposed to authors. The layout solver is the one source of geometry and it produces pixel rects against a canvas the host names; JSON UI's relative sizes appear only where the engine has to decide at draw time — a stack sized so hidden rows collapse, a fill inside a box the layout already sized. A screen-relative canvas is a host property, never a prop.

Sharing one parameterized frame between a look's states does not work. A frame resolves `caption@$core_content` in its own scope, where the variable was never set, so the reference names nothing and the control has no type: the client refuses every caption in the world. Sharing has to happen at the mount, with each consumer carrying the caption name along with the frame.
