---
sidebar_position: 3
description: "A variable row count on a screen whose shape is frozen."
---
# List

However many rows there are, on a screen that cannot grow.

## Import

```tsx
import { List } from '@bedrock-core/ui';
```

## Usage

```tsx
<List max={10} items={players} row={(player, index) => (
  <Panel flexDirection={'row'} gap={4} height={16}>
    <Text maxLength={16}>{player?.name ?? ''}</Text>
    <Text maxLength={4}>{String(index)}</Text>
  </Panel>
)} />
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `max`<Req /> | `number` | — | How many rows are compiled; the screen's declared capacity |
| `items`<Req /> | `readonly T[]` | — | The data; only the first `max` are shown |
| `row`<Req /> | `(item: T \| undefined, index: number) => JSX.Element` | — | One row, called for every compiled slot |

Inherits [control props](../control-props.md).

## How it works

A compiled screen cannot add or drop a row at runtime — the build numbered every cell once — so `<List>` is the one legal way to render a variable count. `max` copies of the row are compiled, a carried int says how many are real, and the compiled gates hide the rest client-side. The shape never moves; only the count does.

Hidden rows take **no space**: the list compiles to a stack panel, which gives an invisible child no room, so the visible rows pack from the top and a [`<Scroll>`](../layout/Scroll.md) over the list scrolls exactly as far as the real rows. That is the one runtime reflow a compiled screen has, and it is the engine's own.

## The row contract

`row` is called `max` times on **every** render, with `undefined` beyond the data. Return the same elements either way, with empty values:

```tsx
row={(item) => <Text maxLength={20}>{item?.label ?? ''}</Text>}
```

That is what makes the shape independent of the data by construction. A row that renders different elements for `undefined` than for an item is a shape change, which the build refuses.

Values that differ per item travel like any other live value — `maxLength` text, a carried `visible`. A baked string fed from item data stays the build's value, which `render(screen, player, { debug: true })` reports.

## Notes

Items beyond `max` are not shown and not carried. `max` is the screen's honest capacity, the way `maxLength` is a string's.

## Limits

The count's carrier reserves the digits of `max`, so a larger capacity costs a wider carrier as well as `max` copies of the row.
