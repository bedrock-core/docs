---
sidebar_position: 6
---
# Fragment

A logical grouping component that doesn't render any visual container.

## Import

```tsx
import { Fragment } from '@bedrock-core/ui';
// Or use the shorthand syntax: <>...</> — no import needed
```

## Usage

### Using Fragment Component

```tsx
<Fragment>
  <Text>{'First element'}</Text>
  <Text>{'Second element'}</Text>
</Fragment>
```

### Using JSX Shorthand

```tsx
<>
  <Text>{'First element'}</Text>
  <Text>{'Second element'}</Text>
</>
```

### Component-Specific Props

#### `children`
- Type: `JSX.Node`
- Description: The children components inside the fragment.

## When to Use Fragment

### Returning Multiple Elements

Components must return a single root element. Use Fragment to return multiple siblings:

```tsx
function Header() {
  return (
    <>
      <Text>{'§lWelcome'}</Text>
      <Text>{'Subtitle text'}</Text>
    </>
  );
}
```

### Avoiding Unnecessary Nesting

Fragment prevents an extra `Panel` wrapper when you don't need a visual container or extra spacing/padding:

```tsx
// ❌ Unnecessary Panel — adds layout overhead you don't need
function MyComponent() {
  return (
    <Panel>
      <Text>{'First'}</Text>
      <Text>{'Second'}</Text>
    </Panel>
  );
}

// ✅ Use Fragment when the surrounding panel already arranges the children
function MyComponent() {
  return (
    <>
      <Text>{'First'}</Text>
      <Text>{'Second'}</Text>
    </>
  );
}
```

### Conditional Rendering

```tsx
function ConditionalContent({ showDetails }: { showDetails: boolean }) {
  return (
    <>
      <Text>{'Always visible'}</Text>
      {showDetails && (
        <>
          <Text>{'Detail 1'}</Text>
          <Text>{'Detail 2'}</Text>
        </>
      )}
    </>
  );
}
```

### List Rendering

```tsx
function ItemList({ items }: { items: { id: number; name: string; description: string }[] }) {
  return (
    <>
      {items.map(item => (
        <Fragment key={item.id}>
          <Text>{item.name}</Text>
          <Text>{`§7${item.description}`}</Text>
        </Fragment>
      ))}
    </>
  );
}
```

## Examples

### Dynamic Content Groups

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

## Best Practices

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
| JSON-UI | Not serialized | Serialized |
