---
sidebar_position: 29
description: "Keep a fixed panel mounted while native selection controls its visibility."
---
# SelectionPanel

Gate a fixed panel's visibility with a native selection group.

## Import

```tsx
import { SelectionPanel } from '@bedrock-core/ui';
```

## Usage

```tsx
<SelectionPanel group={'library_pages'} index={1}>
  <Text>{'Second page'}</Text>
</SelectionPanel>
```

The panel must share its group with native selector inputs. The component provides visibility; a navigation library owns the associated actions and history.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `group`<Req /> | `string` | — | Shared native selection group using letters, digits, underscores or hyphens |
| `index` | `number` | — | One compiled selection index |
| `indexes` | `readonly number[]` | — | Several compiled indexes that can reveal this panel |
| `activeIndexes` | `readonly number[]` | Declared indexes | Restrict membership using server-carried data |
| `children` | `JSX.Node` | — | Content retained beneath the panel |

Inherits [control props](./control-props.md). Supply either `index` or `indexes`, using nonnegative integers. Their universe is fixed during compilation; `activeIndexes` can change membership within that universe.

## Notes

The panel keeps its content mounted while native selection changes visibility. It does not rerun JavaScript when selected. Preserve the compiled layout box when composing several panels over the same area.

Ordinary application navigation uses [static navigators](/docs/navigation) instead of managing these groups directly.
