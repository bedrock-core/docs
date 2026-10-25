---
sidebar_position: 2
description: "Read the route and typed parameters belonging to the current page component."
---
# useRoute

Read the current page's route and parameters.

## Import

```ts
import { useRoute } from '@bedrock-core/navigation';
```

## Signature

```ts
useRoute(screenName?): Route
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `screenName` | Registered screen name | Current page | Narrow the returned route and validate its page scope |

## Returns

A route containing `key`, `name` and optional `params`. A named call infers parameters from the registered root and throws if the component belongs to another screen.

## Usage

```tsx
function DetailsCaption(): JSX.Element {
  const route = useRoute('Details');
  return <Text maxLength={64}>{route.params.itemId}</Text>;
}
```

Use this hook in a page component beneath a mounted navigator. A custom navigator layout retains the page's route scope.

## Notes

Reads happen during server rendering. Native local transitions select already prepared page bodies without rerunning this hook. Supply compilation values with `initialParams` and reserve bounds for live text.
