---
sidebar_position: 28
description: "Compose fully expanded children before layout and native host allocation."
---
# TreeBoundary

Give a component library access to expanded child controls before layout.

## Import

```tsx
import { TreeBoundary } from '@bedrock-core/ui';
```

## Usage

```tsx
<TreeBoundary transform={children => <Panel gap={4}>{[...children]}</Panel>}>
  <Text>{'Library content'}</Text>
</TreeBoundary>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `JSX.Node` | — | Components and controls expanded before transformation |
| `transform`<Req /> | `(children: readonly JSX.Element[]) => JSX.Element` | — | Return the composed control tree |

## Notes

The transform runs before inheritance, layout and host allocation. Keep it pure and return a tree with a stable compiled shape. Hooks belong in the surrounding component, rather than inside the transform callback.

Use [render extensions](../guides/render-extensions.md) for associated compilation data. Navigation libraries normally use [`createNavigatorFactory`](/docs/navigation/api/createNavigatorFactory) to reuse the existing router and planner.
