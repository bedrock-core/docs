---
sidebar_position: 6
---
# Fragment

A logical grouping component that doesn't render any visual container.

## Import

```tsx
import { Fragment } from '@bedrock-core/ui';
// Or use the shorthand syntax: <>...</> no need for import
```

## Usage

### Using Fragment Component

```tsx
<Fragment>
  <Text x={10} y={10} width={200} height={20}>First element</Text>
  <Text x={10} y={40} width={200} height={20}>Second element</Text>
</Fragment>
```

### Using JSX Shorthand

```tsx
<>
  <Text x={10} y={10} width={200} height={20}>First element</Text>
  <Text x={10} y={40} width={200} height={20}>Second element</Text>
</>
```

### Component-Specific Props

#### `children`
- Type: `JSX.Node`
- Default: `undefined`
- Description: The children components inside the panel

## When to Use Fragment

### Returning Multiple Elements

Components must return a single root element. Use Fragment to return multiple siblings:

```tsx
function Header() {
  return (
    <>
      <Text x={10} y={10} width={300} height={30}>Welcome</Text>
      <Text x={10} y={50} width={300} height={25}>Subtitle text</Text>
    </>
  );
}
```

### Avoiding Unnecessary Nesting

Fragment prevents unnecessary `Panel` wrappers when you don't need visual grouping:

```tsx
// ❌ Unnecessary Panel
function MyComponent() {
  return (
    <Panel x={0} y={0} width={300} height={200}>
      <Text x={10} y={10} width={280} height={20}>First</Text>
      <Text x={10} y={40} width={280} height={20}>Second</Text>
    </Panel>
  );
}

// ✅ Use Fragment instead
function MyComponent() {
  return (
    <>
      <Text x={10} y={10} width={280} height={20}>First</Text>
      <Text x={10} y={40} width={280} height={20}>Second</Text>
    </>
  );
}
```

### Conditional Rendering

```tsx
function ConditionalContent({ showDetails }) {
  return (
    <>
      <Text x={10} y={10} width={300} height={20}>Always visible</Text>
      {showDetails && (
        <>
          <Text x={10} y={40} width={300} height={20}>Detail 1</Text>
          <Text x={10} y={70} width={300} height={20}>Detail 2</Text>
        </>
      )}
    </>
  );
}
```

### List Rendering

```tsx
function ItemList({ items }) {
  return (
    <>
      {items.map((item, index) => (
        <Fragment key={item.id}>
          <Text x={10} y={10 + (index * 30)} width={300} height={20}>{item.name}</Text>
          <Text x={10} y={30 + (index * 30)} width={300} height={15}>{item.description}</Text>
        </Fragment>
      ))}
    </>
  );
}
```

## Examples

### Dynamic Content Groups

```tsx
function StatusDisplay({ isOnline }) {
  return (
    <>
      <Text x={10} y={10} width={60} height={20}>Status:</Text>
      {isOnline ? (
        <>
          <Text x={70} y={10} width={100} height={20}>§2Online</Text>
          <Text x={10} y={40} width={300} height={20}>Connected users: 5</Text>
        </>
      ) : (
        <>
          <Text x={70} y={10} width={100} height={20}>§cOffline</Text>
          <Text x={10} y={40} width={300} height={20}>Reconnecting...</Text>
        </>
      )}
    </>
  );
}
```

## Best Practices

- **Prefer shorthand syntax** (`<>...</>`) for better readability
- Use Fragment when you need to return multiple elements from a component
- Don't use Fragment when you need visual grouping or positioning (use `Panel` instead)
- Fragment doesn't affect layout or positioning of child elements

## Fragment vs Panel

| Aspect | Fragment | Panel |
|--------|----------|-------|
| Visual rendering | None | Visible container |
| Control props | Not supported | Supported |
| Use case | Logical grouping | Visual container |
| JSON-UI | Not serialized | Serialized |