---
description: "A header that folds the rows under it entirely on the client, reflowing what is below."
---
# Disclosure

A header that folds the rows under it, entirely on the client.

## Import

```tsx
import { Disclosure } from '@bedrock-core/ui';
```

## Usage

```tsx
<Disclosure
  header={<Text>{'Getting started'}</Text>}
  headerClosed={<Text>{'Getting started...'}</Text>}
  gap={2}
>
  <Link to={'guide:intro'}><Text>{'Intro'}</Text></Link>
  <Link to={'guide:first_steps'}><Text>{'First steps'}</Text></Link>
</Disclosure>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `header`<Req /> | `JSX.Element` | — | What the header draws while the rows show |
| `headerClosed` | `JSX.Element` | `header` | What it draws while they hide |
| `headerHeight` | `number` | `20` | Height of the header box in texels |
| `defaultOpen` | `boolean` | `true` | Whether the rows show when the screen opens |

Inherits [control props](./control-props.md). The flow props — `flexDirection`, `gap`, `justifyContent`, `alignItems`, `alignContent`, `wrap` — apply to the **rows**, since that is what an author writing `gap` on a disclosure means; everything else sizes and places the fold itself.

## What folding costs

The header is a client-side toggle and the rows are a panel that *follows* it, which is vanilla's own idiom for a section that opens and closes. So a fold costs no press, no re-present and no payload.

The rows sit in a stack, and a stack gives a hidden child no space, so everything below moves up when they fold. That is the one native reflow a frozen screen has — the same one [`<List>`](./List.md) is built on.

## Notes

Two headers, because a fold is the only thing that can tell them apart. Each is drawn inside its own state, so either may hold anything.

Rows *follow* the header rather than nesting inside it because content inside a state has no say over its siblings, and rows that have to push what is under them need exactly that.

## Limits

Compiled-only. On a serialized screen a fold would be a re-render, which `useState` already does for nothing.
