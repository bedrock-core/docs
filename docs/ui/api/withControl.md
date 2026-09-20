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

Framework component packages call it once before adding the fields owned by a built-in control:

```tsx
import { withControl, type ControlProps, type FunctionComponent, type JSX } from '@bedrock-core/ui';

interface FrameProps extends ControlProps {
  children?: JSX.Node;
}

const Frame: FunctionComponent<FrameProps> = ({ children, ...rest }: FrameProps): JSX.Element => ({
  type: 'panel',
  props: {
    ...withControl(rest),
    children,
  },
});
```

## Notes

Addon components composed from public controls do not call `withControl`. Returning an arbitrary host-element type does not add that type to the compiler or render pack; see [Extending components](../guides/custom-native-components.md).

The geometry it writes is a placeholder for the layout phase to fill in. Set layout through the flex props (`flexGrow`, `width`, `padding`, …) that `withControl` reads, not the `jsonUIx` / `jsonUIWidth` fields it leaves behind — those are the layout phase's output, not an input.

## Related

- [Control props](../components/control-props.md) — the props every built-in component accepts
- [Extending components](../guides/custom-native-components.md) — the supported addon composition boundary
