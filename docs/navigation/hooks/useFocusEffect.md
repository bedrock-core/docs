---
sidebar_position: 6
description: "Run an effect while a server-navigation page has confirmed focus."
---
# useFocusEffect

Run an effect when the current page gains confirmed focus and clean it up on blur or disposal.

## Import

```ts
import { useFocusEffect } from '@bedrock-core/navigation';
```

## Signature

```ts
useFocusEffect(effect: () => void | (() => void)): void
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `effect`<Req /> | Effect callback | — | Run on confirmed focus and optionally return a cleanup function |

## Returns

`void`

## Usage

```tsx
function Editor(): JSX.Element {
  useFocusEffect(() => {
    console.warn('Editor focused');
    return () => { console.warn('Editor blurred'); };
  });
  return <Text>{'Editor'}</Text>;
}
```

## Notes

The screen, a containing screen, or the root must use [server navigation](../guides/client-navigation.md#force-server-navigation). Native local visits do not generate focus effects.

A changed effect function releases the previous subscription and installs the new one. An ordinary `useEffect` follows component mounting, which also includes inactive resident pages; it does not express page focus.
