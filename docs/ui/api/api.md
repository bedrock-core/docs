---
sidebar_position: 1
description: "render(), the contexts, the compiled-screen registry and the error classes."
---
# API

The top-level surface: showing a screen, the contexts around it, and the records the build leaves behind.

## Showing a screen

- [`render(root, player, options?)`](./render.md) — show a compiled screen to one player and keep it shown across its state changes
- [`endRender(player, options?)`](./render.md#end-a-render-session) — release a player's render session and optionally close native forms
- [`observeRenderLifecycle(listener, options?)`](./render.md#observe-render-sessions) — observe server-side session starts, replacements and endings
- [`refreshRender(player)`](./render.md#refresh-an-open-form) — re-present the current form while retaining hook state
- `createContainerScreen(Screen)` — serve a [container screen](../guides/container-screens.md), from `@bedrock-core/ui/container`

## Contexts

- [`createContext(defaultValue)`](./createContext.md) — pass a value down the tree without prop drilling
- [`TranslationContext`](./TranslationContext.md) — how localized text resolves for a subtree; `render()` provides it at every root, so you rarely provide it yourself
- [`ModalContext`](./ModalContext.md) — marks that a subtree is inside a `<Form>`; read by the build's restriction pass

## Navigation

`@bedrock-core/navigation` owns routing, links, resident stacks and player history. `@bedrock-core/ui/navigation` is its UI facade. The optional `@bedrock-core/navigation/core` entry point provides `createCoreNavigationAdapter(core)` for the same route tree. The main UI entry point exposes rendering and controls independently of navigation.

- [Server destinations](/docs/navigation/navigate) — `navigate`, `navigateAsync`, `back` and `closeUi`
- [`useNavigation()`](/docs/navigation/hooks/useNavigation) — typed operations on the confirmed route tree
- [Static navigators](/docs/navigation/api/createStaticNavigation) — `createStackNavigator`, `createTopTabNavigator` and `createStaticNavigation`
- [Screen metadata and parameter contracts](/docs/navigation/references) — local descriptors and the published registry
- [Host openers and realm transport](/docs/navigation/realm) — `navigation(core)` and `register()`

## Build records

- [Compiled screens](./compiled-screens.md) — the component-to-title registry, the snapshot a `debug` render is diffed against, and the reference table a static screen publishes

## Errors

- [Errors](./errors.md) — every error class the library throws and the fix each one names

## Types

```ts
import type {
  ControlProps, LayoutProps, FunctionComponent, JSX, RenderOptions,
  PressEvent, SlotEvent, SubmitEvent, UiEvent, ContainerEvent,
  CompiledSnapshot, RenderSession, RenderLifecycleEvent,
} from '@bedrock-core/ui';
import type {
  DestinationOptions, DestinationKey, StaticScreenProps, StaticParamList,
} from '@bedrock-core/ui/navigation';
```

Every component's props type is exported beside it — `ButtonProps`, `TextProps`, `ListProps`, `TabsProps` and the rest — and every flex primitive through [`@bedrock-core/ui/flexbox`](/docs/flexbox).

## Advanced

- [`withControl(props)`](./withControl.md) — low-level control normalization used by framework component packages
- [Extending components](../guides/custom-native-components.md) — compose public controls and understand the native-control boundary
- [Build integration](../compiler/api.md) — compile addon screens with builder
- [Render extensions](../guides/render-extensions.md) — expanded-tree composition, compilation data and render ownership

## Next steps

- [Components](../components/components.md) — every built-in component
- [Hooks](../hooks/hooks.md) — state and effects
- [Hosts](../guides/hosts.md) — what each screen can carry
