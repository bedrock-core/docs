---
description: "Thin horizontal or vertical separator."
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

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction of the divider. Horizontal dividers take their width from the container; vertical dividers take their height from the container |
| `variant` | `'default' \| 'light' \| 'dark'` | `'default'` | Visual weight. `default` is 2px thick; `light` and `dark` are 1px each |

Inherits [control props](/docs/ui/components/control-props).

## Examples

### Vertical divider

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

## Notes

- Use `light` between dense rows of related content, `default` to break a card into distinct sections, and `dark` on lighter backgrounds where you need extra contrast.
- A divider's `width` (horizontal) or `height` (vertical) comes from its parent — don't hard-code it unless you really need to.
