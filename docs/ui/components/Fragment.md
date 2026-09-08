---
sidebar_position: 7
description: "A logical grouping component that doesn't render any visual container."
---
# Fragment

A logical grouping component that doesn't render any visual container.

## Import

```tsx
import { Fragment } from '@bedrock-core/ui';
// Or use the shorthand syntax: <>...</> — no import needed
```

## Usage

### Using fragment component

```tsx
<Fragment>
  <Text>{'First element'}</Text>
  <Text>{'Second element'}</Text>
</Fragment>
```

### Using JSX shorthand

```tsx
<>
  <Text>{'First element'}</Text>
  <Text>{'Second element'}</Text>
</>
```

### Component-Specific props

| Prop | Type | Description |
| --- | --- | --- |
| `children` | `JSX.Node` | The children components inside the fragment |

## Examples

### Dynamic content groups

```tsx
function StatusDisplay({ isOnline }: { isOnline: boolean }) {
  return (
    <>
      <Text>{'Status:'}</Text>
      {isOnline ? (
        <>
          <Text>{'§2Online'}</Text>
          <Text>{'Connected users: 5'}</Text>
        </>
      ) : (
        <>
          <Text>{'§cOffline'}</Text>
          <Text>{'Reconnecting...'}</Text>
        </>
      )}
    </>
  );
}
```

## Notes

- **Prefer the shorthand syntax** (`<>...</>`) for readability.
- Use Fragment when you need to return multiple elements from a component.
- Don't use Fragment when you need a visual container or its own flex layout (use `Panel` instead).
- Fragment participates in the parent's flex flow — its children are lifted into the parent's layout.

## Fragment vs Panel

| Aspect | Fragment | Panel |
|--------|----------|-------|
| Visual rendering | None | Visible container |
| Layout props | Not supported | Supported |
| Flex container | No (children lifted into parent flow) | Yes |
| Use case | Logical grouping | Visual container with its own layout |
