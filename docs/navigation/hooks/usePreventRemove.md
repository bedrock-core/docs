---
sidebar_position: 7
description: "Intercept server actions that would remove the current page from route history."
---
# usePreventRemove

Prevent a server navigation action from removing the current page.

## Import

```ts
import { usePreventRemove } from '@bedrock-core/navigation';
```

## Signature

```ts
usePreventRemove(enabled: boolean, callback: (event) => void): void
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled`<Req /> | `boolean` | — | Block route removal while true |
| `callback`<Req /> | `({ data: { action } }) => void` | — | Receive the blocked action |

## Returns

`void`

## Usage

```tsx
function Editor(): JSX.Element {
  usePreventRemove(true, event => {
    console.warn(`Blocked ${event.data.action.type}`);
  });
  return <Text>{'Save before leaving'}</Text>;
}
```

## Notes

The screen, a containing screen, or the root must use [server navigation](../guides/client-navigation.md#force-server-navigation). Disable the guard before dispatching a previously blocked action.

This guard handles route-removing actions. Dismissing the native form closes its host and does not dispatch route Back.
