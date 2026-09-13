---
slug: /
sidebar_position: 1
sidebar_label: Overview
description: "@bedrock-core/navigation moves a player from one compiled screen to another by key, across addons."
---
# navigation

`@bedrock-core/navigation` moves a player from one screen to another by **key**, and keeps a stack of where they have been.

:::caution Pre-1.0
`@bedrock-core/navigation` is under active development. Breaking changes can still land until `1.0.0` — pin exact versions and read the release notes before upgrading.
:::

## What is @bedrock-core/navigation?

A [compiled screen](/docs/ui/compiler) is drawn from the resource pack by its title, and its shape is frozen at build. That rules out the navigator every React app has — a stack of components swapped inside one root — because there is no root to swap into.

What fits is a stack of **keys**. `navigate('shop:catalog', player)` shows that screen and puts the one the player was on behind them; `back(player)` returns to it.

The key is `<addon>:<name>`, and that is what makes this work across addons: a key for a screen nobody in this realm compiled still resolves, through the reference its owner replicated.

## Install

<Install pkg="@bedrock-core/navigation" />

Peer dependency: `@bedrock-core/ui-runtime`, which an addon already has through [`@bedrock-core/ui`](/docs/ui).

## Quick start

```ts title="packs/BP/scripts/main.ts"
import { core } from '@bedrock-core/server';
import { navigate, provideReferences, screens } from '@bedrock-core/navigation';
import { uiReference } from '@bedrock-core/generated/ui';
import '@bedrock-core/generated/ui';

core.register({ manifest });

// Publish this addon's screens so other realms can show them.
screens(core).provide(uiReference());

// Resolve a key this bundle did not compile, from whoever owns it.
provideReferences(key => screens(core).find(key));

export function openCatalog(player: Player): void {
  navigate('shop:catalog', player);
}
```

Inside a screen, reach for the hook instead — the player is already in hand:

```tsx
function Row(): JSX.Element {
  const { navigate, back, canGoBack } = useNavigation();

  return (
    <Panel flexDirection={'row'} gap={4}>
      <Button onPress={() => navigate('shop:catalog')}><Text>{'Catalog'}</Text></Button>
      <Button visible={canGoBack} onPress={() => back()}><Text>{'Back'}</Text></Button>
    </Panel>
  );
}
```

## What you get

**A stack that survives a frozen layout** — it holds keys, not trees. Going back means showing that screen again, drawn from its own initial state; the state of the screen being returned to went with its fibers.

**Screens other addons can open** — publish your static screens once and `navigate('<you>:<screen>')` works in any realm in the world, whether or not your script runs there. The client draws it from the pack it already holds.

**A press that is data** — [`<Link to>`](/docs/ui/components/controls/Link) puts the destination on the element rather than in a closure, so the build can read where it leads and describe the screen to other addons.

## Next steps

- [Moving between screens](./navigate.md) — `navigate`, `back`, `replace`, `reset` and what each does to the stack
- [`useNavigation`](./useNavigation.md) — the same calls inside a screen, bound to its player
- [References](./references.md) — publishing your screens and resolving another addon's
- [Navigation in the ui docs](/docs/ui/guides/navigation) — screen keys, `<Link>` and static screens
