---
sidebar_position: 4
description: "Attach declarative navigation metadata to a custom button without wrapping its handler."
---
# useLinkProps

Create a described press handler for a custom navigation button.

## Import

```ts
import { useLinkProps } from '@bedrock-core/navigation';
```

## Signature

```ts
useLinkProps(destination): { readonly onPress: (event: NavigationPressEvent) => void }
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `destination`<Req /> | Typed route destination or action | — | Route name and parameters, or a portable action |

The destination accepts `screen`, `params`, `in`, `action` and `navigation` with the same meanings as [Link](../components/Link.md).

## Returns

An `onPress` handler carrying readable navigation metadata. The compiler can turn the intact handler into a native local input.

## Usage

```tsx
function DetailsButton(): JSX.Element {
  const props = useLinkProps({ screen: 'Details' });
  return <Button {...props}><Text>{'Details'}</Text></Button>;
}
```

Call the hook inside a mounted static navigator. Spread the returned handler onto a button unchanged. A wrapper such as `onPress={event => props.onPress(event)}` runs through the server because it does not retain the description.

Set `navigation: 'server'` when the transition requires server dispatch. Perform other server work in an ordinary button callback or a Link interceptor.
