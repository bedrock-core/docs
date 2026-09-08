---
sidebar_position: 2
description: "Themed button with seven visual variants."
---
# Button

Themed button with seven visual variants. Built on top of the [`Button`](/docs/ui/components/Button) primitive and the [theme](./theme.md) token map.

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

### Component-Specific props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'hero' \| 'primary' \| 'secondary' \| 'contrast' \| 'danger' \| 'realm' \| 'transparent'` | `'primary'` | Selects the texture set and text style applied to the button. `hero` uses the same primary texture but with the `minecraftTen` heading font. `transparent` has no visible shell — useful for icon-only or inline actions that should blend into the background |
| `enabled` | `boolean` | `true` | When `false`, the button renders with the disabled texture and ignores `onPress`. The disabled `textStyle` color is automatically applied to string children |
| `onPress` | `() => void \| Promise<void>` | — | Callback invoked when the player presses the button |
| `children` | `string \| JSX.Node` | — | A string is auto-wrapped in a themed `Text`. Any other node is rendered as-is |

### Control props

Button inherits all standard [control props](/docs/ui/components/control-props).

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
  <Button variant={'transparent'} onPress={() => {}}>{'Transparent'}</Button>
</Panel>
```

### Disabled

```tsx
<Button variant={'primary'} enabled={false}>
  {'Unavailable'}
</Button>
```

### Custom children

```tsx
<Button variant={'primary'} onPress={() => {}}>
  <Image width={16} height={16} texture={'textures/items/diamond'} />
</Button>
```

## Notes

- Use `hero` for the single most important CTA on a screen (it picks up the heading font).
- Reach for `secondary` or `contrast` when stacking multiple actions so the primary call-to-action stays visually dominant.
- Use `danger` for destructive actions only — players learn to associate the red texture with caution.
- Use `transparent` when the button needs to occupy a hit-zone without adding visual weight — icon wrappers, inline row actions, header controls.
- Let the variant pick the color; don't manually prefix string children with `§` codes, the theme does it for you.
