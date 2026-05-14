---
sidebar_position: 2
---
# Button

Themed button with six visual variants. Built on top of the [`Button`](../components/Button.md) primitive and the [theme](./theme.md) token map.

![Button](/img/ore-styled/Button.png)

## Import

```tsx
import { Button } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<Button onPress={() => console.log('clicked')}>
  {'Click Me'}
</Button>
```

When `children` is a string the button automatically wraps it in a `Text` styled by the active variant's `textStyle` (font, scale, and color/disabled-color prefix). Pass a `Text` or other JSX node directly to bypass that auto-wrapping.

## Props

### Component-Specific Props

#### `variant`
- Type: `'hero' | 'primary' | 'secondary' | 'contrast' | 'danger' | 'realm'`
- Default: `'primary'`
- Description: Selects the texture set and text style applied to the button. `hero` uses the same primary texture but with the `minecraftTen` heading font.

#### `enabled`
- Type: `boolean`
- Default: `true`
- Description: When `false`, the button renders with the disabled texture and ignores `onPress`. The disabled `textStyle` color is automatically applied to string children.

#### `onPress`
- Type: `() => void | Promise<void>`
- Description: Callback invoked when the player presses the button.

#### `children`
- Type: `string | JSX.Node`
- Description: A string is auto-wrapped in a themed `Text`. Any other node is rendered as-is.

### Control Props

Button inherits all standard [control props](../components/control-props.md).

## Examples

### Variants

```tsx
<Panel flexDirection={'column'} gap={6} padding={10}>
  <Button variant={'hero'} onPress={() => {}}>{'Hero'}</Button>
  <Button variant={'primary'} onPress={() => {}}>{'Primary'}</Button>
  <Button variant={'secondary'} onPress={() => {}}>{'Secondary'}</Button>
  <Button variant={'contrast'} onPress={() => {}}>{'Contrast'}</Button>
  <Button variant={'danger'} onPress={() => {}}>{'Danger'}</Button>
  <Button variant={'realm'} onPress={() => {}}>{'Realm'}</Button>
</Panel>
```

### Disabled

```tsx
<Button variant={'primary'} enabled={false}>
  {'Unavailable'}
</Button>
```

### Custom Children

```tsx
<Button variant={'primary'} onPress={() => {}}>
  <Image width={16} height={16} texture={'textures/items/diamond'} />
</Button>
```

## Best Practices

- Use `hero` for the single most important CTA on a screen (it picks up the heading font).
- Reach for `secondary` or `contrast` when stacking multiple actions so the primary call-to-action stays visually dominant.
- Use `danger` for destructive actions only — players learn to associate the red texture with caution.
- Let the variant pick the color; don't manually prefix string children with `§` codes, the theme does it for you.
