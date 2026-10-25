---
sidebar_position: 5
description: "Read confirmed focus for a page configured to use server navigation."
---
# useIsFocused

Read whether this page is focused in the server-confirmed route tree.

## Import

```ts
import { useIsFocused } from '@bedrock-core/navigation';
```

## Signature

```ts
useIsFocused(): boolean
```

## Parameters

None. The hook uses the current page scope.

## Returns

`true` when the page's route is focused through every containing navigator.

## Usage

```tsx
function EditorStatus(): JSX.Element {
  const focused = useIsFocused();
  return <Text maxLength={16}>{focused ? 'Editing' : 'Inactive'}</Text>;
}
```

## Notes

Configure the screen, a containing screen, or the root for [server navigation](../guides/client-navigation.md#force-server-navigation). Compilation rejects this hook when its page can navigate locally, because native selection does not execute JavaScript focus reads.
