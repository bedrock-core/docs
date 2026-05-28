---
sidebar_position: 9
---
# Divider

Thin horizontal or vertical separator. Useful for splitting sections inside a `Card` or a `Panel`.

![Divider](/img/ore-styled/Divider.png)

## Import

```tsx
import { Divider } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<Card>
  <Text>{'Section 1'}</Text>
  <Divider />
  <Text>{'Section 2'}</Text>
</Card>
```

The divider stretches along the cross-axis of its parent. Inside a column `Panel` it draws horizontally; inside a row `Panel` set `orientation={'vertical'}`.

## Props

### Component-Specific Props

#### `orientation`
- Type: `'horizontal' | 'vertical'`
- Default: `'horizontal'`
- Description: Direction of the divider. Horizontal dividers take their width from the container; vertical dividers take their height from the container.

#### `variant`
- Type: `'default' | 'light' | 'dark'`
- Default: `'default'`
- Description: Visual weight. `default` is 2px thick; `light` and `dark` are 1px each.

### Control Props

Divider inherits all standard [control props](../ui-runtime/components/control-props.md).

## Examples

### Vertical Divider

```tsx
<Panel flexDirection={'row'} alignItems={'stretch'} gap={6} padding={10}>
  <Text>{'Left'}</Text>
  <Divider orientation={'vertical'} />
  <Text>{'Right'}</Text>
</Panel>
```

### Variants

```tsx
<Panel flexDirection={'column'} gap={8} padding={10}>
  <Divider variant={'default'} />
  <Divider variant={'light'} />
  <Divider variant={'dark'} />
</Panel>
```

## Best Practices

- Use `light` between dense rows of related content, `default` to break a card into distinct sections, and `dark` on lighter backgrounds where you need extra contrast.
- A divider's `width` (horizontal) or `height` (vertical) comes from its parent — don't hard-code it unless you really need to.
