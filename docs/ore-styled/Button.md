---
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
<Button onPress={() => console.warn('clicked')}>
  {'Click Me'}
</Button>
```

When `children` is a string the button automatically wraps it in a `Text` styled by the active variant's `textStyle` (font, scale, and color/disabled-color prefix). Pass a `Text` or other JSX node directly to bypass that auto-wrapping.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'hero' \| 'primary' \| 'secondary' \| 'contrast' \| 'danger' \| 'realm' \| 'transparent'` | `'primary'`, or `'secondary'` for `action={'exit'}` | The texture set and text style. `hero` is the primary texture with the `minecraftTen` heading font; `transparent` has no shell, for icon-only or inline actions |
| `children` | `string \| JSX.Node` | — | A string is auto-wrapped in a themed `Text`; any other node is rendered as-is |
| `onPress` | `(event: PressEvent) => unknown \| Promise<unknown>` | — | Runs on the press, with the player who pressed. A form's submit and exit are `Form.Button`; use `to` when the press opens another screen |
| `to` | `ScreenKey` | — | The screen this button opens, `<addon>:<name>`. A button with one is a [`<Link>`](/docs/ui/components/Link) |
| `replace` | `boolean` | `false` | With `to`: take the place of the screen this button is on rather than stacking over it |
| `back` | `boolean` | `false` | The way back, in place of `to` — the player's own stack decides where |
| `enabled` | `boolean` | `true` | `false` draws the disabled texture, ignores the press, and applies the disabled text color to string children |

Inherits [control props](/docs/ui/components/control-props).

## A form's two actions

Inside a [`<Form>`](/docs/ui/components/Form) the form's own two controls are `Form.Button`s rather than handlers: `type={'submit'}` submits and `type={'exit'}` dismisses. Exactly one submit is required, at most one exit beside it.

```tsx
<Panel flexDirection={'row'} gap={4}>
  <Form.Button type={'submit'} flex={2}>{'Save'}</Form.Button>
  <Form.Button type={'exit'} variant={'danger'} flex={1}>{'Cancel'}</Form.Button>
</Panel>
```

Keep the default variants — primary for the submit, secondary for the exit — unless there is a reason to deviate, such as a `danger` exit when cancelling discards real progress. And give the submit an actionable caption: "Save", not "Submit".

## A press or a destination

`onPress` is script: only this realm can run it. `to` and `back` are **data** the build reads off the element, which is what lets a screen of buttons be [described to another addon](/docs/ui/guides/navigation#static-screens) and shown by a realm running none of your script.

Reach for `to` whenever the press simply opens a screen, and keep a handler for the presses that do something.

```tsx
<Button to={'shop:catalog'}>{'Catalog'}</Button>
<Button back variant={'secondary'}>{'Back'}</Button>
```

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
