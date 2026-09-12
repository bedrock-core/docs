---
sidebar_position: 2
description: "navigate, back, replace and reset: the four ways to move a player, and what each does to the stack."
---
# Moving between screens

Four calls, distinguished by what they leave behind the player.

## Import

```ts
import { back, canGoBack, currentKey, historyOf, navigate, replace, reset } from '@bedrock-core/navigation';
```

## Signatures

```ts
navigate(key: ScreenKey, player: Player, options?: NavigateOptions): boolean
replace(key: ScreenKey, player: Player, options?: Omit<NavigateOptions, 'replace'>): boolean
reset(key: ScreenKey, player: Player, options?: Omit<NavigateOptions, 'replace'>): boolean
back(player: Player, options?: Omit<NavigateOptions, 'replace'>): boolean
```

| Call | The stack afterwards |
| --- | --- |
| `navigate` | one deeper — the screen they were on is behind them |
| `replace` | exactly as deep as it was — a back from the target returns past this screen |
| `reset` | empty — a back from the target has nowhere to go |
| `back` | one shallower — the screen behind becomes the current one |

Each returns whether a screen was shown. A `false` is a key nothing resolved: a screen that did not compile, an addon nobody in this realm is running, or a typo. It is warned about where it is decided, never thrown.

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `params` | `Record<string, unknown>` | — | Props the target screen is rendered with |
| `replace` | `boolean` | `false` | Show the screen in place of the current one; `replace()` is this with the flag already set |
| `debug` | `boolean` | `false` | Diff every present against the snapshot the build recorded and warn on drift |

`params` fill what the layout already reserved. A compiled screen's shape is frozen, so they can never add or drop a cell — a generic screen's labels and values, not its structure.

## Which one to reach for

**`navigate`** is the default: the player is going somewhere they will come back from.

**`replace`** is for screens that are peers, where none is the way back to another — the pages of a guide, the tabs of a set. A redirect is the other case.

**`reset`** is what a menu's root wants. Going back out of the first screen of a flow should end the flow, not walk into whatever the player was looking at before it.

**`back`** needs no key: the player's own stack decides.

## Reading the stack

```ts
historyOf(player: Player): readonly string[]
currentKey(player: Player): ScreenKey | undefined
canGoBack(player: Player): boolean
```

`historyOf` is the keys behind the player, oldest first. `currentKey` is the screen they are looking at. `canGoBack` is whether there is anything behind it — what a back control's `visible` wants.

## Examples

### A flow whose first screen ends it

```ts
export function openShop(player: Player): void {
  reset('shop:home', player);
}
```

A `back` from `shop:home` now returns `false`, so the control that calls it can be hidden with `canGoBack(player)`.

### Pages that move sideways

```ts
export function openPage(player: Player, pageId: string): void {
  replace(`guide:${pageId}`, player);
}
```

The guide's index stays the thing a back returns to, however many pages deep the player reads.

### Filling a generic screen

```ts
navigate('shop:item', player, { params: { itemId: 'diamond', price: 64 } });
```

## Notes

Closing what a player is looking at from outside a screen is [`closeUi(player)`](/docs/ui/guides/navigation), from `@bedrock-core/ui` — it clears the stack as well. A screen closing itself is [`useExit()`](/docs/ui/hooks/useExit).

A container screen has no key, so none of these can open one. A chest is entered by walking up to an entity.
