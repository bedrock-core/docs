---
sidebar_position: 13
description: "Several panes on one screen, switched on the client with nothing reaching script."
---
# Tabs

Several panes on one screen, switched without the server hearing about it.

## Import

```tsx
import { Tabs } from '@bedrock-core/ui';
```

## Usage

```tsx
<Tabs tabHeight={20} flexGrow={1}>
  <Tabs.Tab header={<Text>{'Items'}</Text>} headerSelected={<Text shadow>{'Items'}</Text>}>
    <ItemList />
  </Tabs.Tab>
  <Tabs.Tab header={<Text>{'Log'}</Text>}>
    <Log />
  </Tabs.Tab>
</Tabs>
```

## Props

### Tabs

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tabHeight` | `number` | `20` | Height of the header row in texels; the panes take what is left |

### Tabs.Tab

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `header`<Req /> | `JSX.Element` | — | The header while this tab is not the chosen one |
| `headerSelected` | `JSX.Element` | `header` | The header while it is |

Both inherit [control props](./control-props.md).

## What it costs

A tab change costs no press, no re-present and no payload: each header is a client-side toggle and its pane is drawn **inside** the chosen state. Nothing outside the toggle observes which tab is open, so nothing has to be told when it changes.

What you pay instead is pack size. Every tab's content is in the tree at once, so N tabs draw N times the controls — paid once at build and nothing at runtime, which is what makes tabs essentially free however many there are.

## When it is a screen instead

What you give up is exactly what "the server never hears it" means: no handler runs on a switch, and nothing outside the group can know which tab is open. A tab whose content depends on the switch is a screen change, not a tab — use [`<Link>`](./Link.md) or `navigate()`.

## Notes

A pane that is not showing is never built, which is what keeps a native field inside a tab off a collection row that is not there.

The panes are laid out beside the headers, filling the box below them; the compile re-bases each into its header's toggle.

A `<Tabs.Tab>` written outside a `<Tabs>` is refused by its type.

## Limits

Compiled-only. On a serialized screen every switch would be N times the payload on every present, so the build says so rather than drawing it.
