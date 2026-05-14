---
sidebar_position: 3
---
# Card

Themed container that wraps the [`Panel`](../components/Panel.md) primitive with the standard Minecraft card background, padding, and gap. Use it to group related content into a single visual unit.

![Card](/img/ore-styled/Card.png)

## Import

```tsx
import { Card } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<Card>
  <Text>{'§lInventory full'}</Text>
  <Text>{'Drop items to make room.'}</Text>
</Card>
```

Cards lay their children out as a column with the theme's standard `gap`. Override `flexDirection`, `padding`, or `gap` via control props if you need to.

## Props

### Component-Specific Props

#### `children`
- Type: `JSX.Node`
- Description: Content rendered inside the card.

### Control Props

Card inherits all standard [control props](../components/control-props.md). Use them to size the card, override the default padding, or change the flex direction.

## Examples

### Two-column Card

```tsx
<Card flexDirection={'row'} gap={10}>
  <Image width={32} height={32} texture={'textures/items/diamond'} />
  <Panel flexDirection={'column'} gap={2}>
    <Text>{'§lDiamond'}</Text>
    <Text>{'§7A rare gem.'}</Text>
  </Panel>
</Card>
```

### Card with Action Row

```tsx
<Card>
  <Text>{'§lConfirm purchase'}</Text>
  <Text>{'Spend 32 emeralds?'}</Text>
  <Panel flexDirection={'row'} gap={6}>
    <Button variant={'secondary'} flex={1} onPress={() => {}}>{'Cancel'}</Button>
    <Button variant={'primary'} flex={1} onPress={() => {}}>{'Buy'}</Button>
  </Panel>
</Card>
```

## Best Practices

- Use a card to scope a single logical concept — don't pile unrelated sections into one card.
- Combine with [`Divider`](./Divider.md) to separate distinct rows inside the same card.
