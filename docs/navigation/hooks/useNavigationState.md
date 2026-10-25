---
sidebar_position: 3
description: "Select data from the server-confirmed root or a named containing navigator."
---
# useNavigationState

Select a value from server-confirmed navigation state.

## Import

```ts
import { useNavigationState } from '@bedrock-core/navigation';
```

## Signature

```ts
useNavigationState(selector): Value
useNavigationState(screenName, selector): Value
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `screenName` | Registered screen name | Root scope | Select the navigator containing this screen |
| `selector`<Req /> | `(state) => Value` | — | Read the required slice of confirmed state |

## Returns

The selector's result for the current server rendering. State includes the navigator's `key`, `type`, `index`, `routeNames` and `routes`; nested route state is stored on its route.

## Usage

```tsx
function VisitCount(): JSX.Element {
  const count = useNavigationState(state => state.routes.length);
  return <Text maxLength={24}>{`Confirmed routes: ${count}`}</Text>;
}
```

## Notes

The hook does not subscribe to unreported native selections. A server action confirms the active local context before dispatch; the next render reads that confirmed state. Use a selector without side effects.
