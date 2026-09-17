---
sidebar_position: 8
description: "Fill a native component's control props with their defaults and package its layout for the compiler."
---
# withControl

Fills a native component's control props with their defaults, and packages its layout for the compiler.

## Import

```tsx
import { withControl } from '@bedrock-core/ui';
```

## Signature

```ts
function withControl(props: JSX.Props): JSX.Props
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `props`<Req /> | `JSX.Props` | — | The author's props, read for [control props](../components/control-props.md) and every flex layout prop |

## Returns

`JSX.Props` — `visible`, `enabled` and `background` filled with their defaults, the element's font slot and scroll region, and a `__layout` block the layout phase reads and replaces with the computed geometry.

## Usage

Every built-in component calls it once, spreading the author's own props through first:

```tsx
import { withControl, type ControlProps, type FunctionComponent, type JSX } from '@bedrock-core/ui';

interface RatingProps extends ControlProps {
  stars: number;
}

const Rating: FunctionComponent<RatingProps> = ({ stars, ...rest }: RatingProps): JSX.Element => ({
  type: 'mypack:rating',
  props: {
    ...withControl(rest),
    stars,
  },
});
```

## Notes

Only needed when writing a [custom native component](../guides/custom-native-components.md) — a function that returns a host element directly. A component composed from other components (one that returns JSX rather than a host element) never calls it itself.

The geometry it writes is a placeholder for the layout phase to fill in. Set layout through the flex props (`flexGrow`, `width`, `padding`, …) that `withControl` reads, not the `jsonUIx` / `jsonUIWidth` fields it leaves behind — those are the layout phase's output, not an input.

## Related

- [Control props](../components/control-props.md) — the props every built-in component accepts
- [Custom native components](../guides/custom-native-components.md) — the one place authoring code calls this directly
