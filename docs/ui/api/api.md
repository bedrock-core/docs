---
sidebar_position: 1
description: "render(), the contexts, the compiled-screen registry and the error classes."
---
# API

The top-level surface: showing a screen, the contexts around it, and the records the build leaves behind.

## Showing a screen

- [`render(root, player, options?)`](./render.md) — show a compiled screen to one player and keep it shown across its state changes
- [`navigate(key, player, options?)`](../guides/navigation.md) — open a screen by key, including one another addon built
- `back(player)` — return to the screen the player came from
- `closeUi(player)` — close what a player is looking at, from outside the screen
- `createContainerScreen(Screen)` — serve a [container screen](../guides/container-screens.md), from `@bedrock-core/ui/container`

## Contexts

- [`createContext(defaultValue)`](./createContext.md) — pass a value down the tree without prop drilling
- [`TranslationContext`](./TranslationContext.md) — how localized text resolves for a subtree; `render()` provides it at every root, so you rarely provide it yourself
- `ModalContext` — marks that a subtree is inside a `<Form>`; read by the build's restriction pass

## Build records

- [Compiled screens](./compiled-screens.md) — the component-to-title registry, the snapshot a `debug` render is diffed against, and the reference table a static screen publishes

## Errors

- [Errors](./errors.md) — every error class the library throws and the fix each one names

## Types

```ts
import type {
  ControlProps, LayoutProps,
  FunctionComponent, JSX,
  NavigateOptions, RenderOptions, ScreenKey, ScreenKeys,
  PressEvent, SlotEvent, SubmitEvent, UiEvent, ContainerEvent,
  CompiledScreen, CompiledSnapshot,
  AddonReference, ScreenReference, ReferenceTarget, WalkResult,
} from '@bedrock-core/ui';
```

Every component's props type is exported beside it — `ButtonProps`, `TextProps`, `ListProps`, `TabsProps` and the rest — and every flex primitive through [`@bedrock-core/ui/flexbox`](/docs/flexbox).

## Advanced

- [Custom native components](../guides/custom-native-components.md) — register your own native component `type` that the runtime serializes and your resource pack's JSON UI decodes
- [`@bedrock-core/ui-compiler`](../compiler/api.md) — the build-time library, for tooling rather than for addons

## Next steps

- [Components](../components/components.md) — every built-in component
- [Hooks](../hooks/hooks.md) — state and effects
- [Hosts](../guides/hosts.md) — what each screen can carry
