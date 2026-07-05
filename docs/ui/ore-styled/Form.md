---
sidebar_position: 12
---
# Form

Themed modal form. Wraps the [`Form`](../ui-runtime/components/Form.md) primitive with authentic Minecraft textures from the [theme](./theme.md) — same config (`onSubmit`/`onCancel`), a themed field for each runtime field, and a couple of ore-styled-only conveniences.

## Import

```tsx
import { Form } from '@bedrock-core/ore-styled';
```

`Form` is a namespace object, mirroring the runtime's shape so a screen switches styled ↔ unstyled by changing only the import:

- [**`Form`**](#props) — the root component; unchanged from the primitive.
- [**`Form.Toggle`**](./FormToggle.md) — themed on/off switch, settings-row style.
- [**`Form.Checkbox`**](./FormCheckbox.md) — themed checkbox, same underlying control as `Form.Toggle`.
- [**`Form.Radio`**](./FormRadio.md) — themed single-select radio group.
- [**`Form.ToggleButton`**](./FormToggleButton.md) — themed single-select segmented group.
- [**`Form.Slider`**](./FormSlider.md) — themed numeric slider.
- [**`Form.Dropdown`**](./FormDropdown.md) — themed select-with-popup field.
- [**`Form.Input`**](./FormInput.md) — themed text field.
- [**`Form.Button`**](./FormButton.md) — themed submit/exit action button.

:::note
Unlike the runtime namespace, ore-styled's `Form` does **not** re-export `InlineSelect`/`Option` at this level — those two runtime primitives are used only internally, by `Form.Radio` and `Form.ToggleButton`.
:::

Every field here accepts a `label?: string` that the runtime primitives don't have — the modal-only primitives are deliberately label-free, so this layer composes the caption for you (above the control for `Input`/`Dropdown`/`Slider`/`Radio`/`ToggleButton`, or beside it as a settings row for `Toggle`/`Checkbox`).

## Rules & Restrictions

Unchanged from the primitive — see the runtime [`Form`'s Rules & Restrictions](../ui-runtime/components/Form.md#rules--restrictions): exactly one `Form.Button type="submit"` required, at most one `type="exit"`, no nesting, no plain `Button`/`ItemRenderer` inside.

## Examples

### Themed settings form

```tsx
<Form onSubmit={v => console.log(v)} onCancel={back}>
  <Form.Dropdown label={'Mode'} name={'mode'} options={['Easy', 'Normal', 'Hard']} defaultValue={'Normal'} />
  <Form.Toggle label={'Music'} name={'music'} defaultValue={true} />
  <Form.Checkbox label={'I agree to the terms'} name={'agree'} defaultValue={false} />

  <Panel flexDirection={'row'} gap={theme.tokens.spacing.sm}>
    <Form.Radio
      label={'Team'}
      name={'team'}
      options={[{ value: 'red', label: 'Red' }, { value: 'blue', label: 'Blue' }]}
      defaultValue={'blue'}
      flex={1}
    />
    <Form.ToggleButton
      label={'View'}
      name={'view'}
      options={[{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }]}
      defaultValue={'grid'}
      flex={1}
    />
  </Panel>

  <Form.Input label={'Nickname'} name={'nickname'} placeholder={'§7type here'} />
  <Form.Slider label={'Volume'} name={'volume'} min={0} max={10} defaultValue={5} />

  <Panel flexDirection={'row'} gap={theme.tokens.spacing.sm}>
    <Form.Button type={'submit'} label={'Save'} flex={2} />
    <Form.Button type={'exit'} label={'Cancel'} variant={'danger'} flex={1} />
  </Panel>
</Form>
```

## Best Practices

- Prefer this themed `Form` for any screen that should match the rest of your Minecraft-styled UI; drop to the raw runtime [`Form`](../ui-runtime/components/Form.md) only when building fully custom, unstyled UI.
- `Form.Radio`/`Form.ToggleButton`/`Form.Dropdown` all report the selected option's **index**, not its value — see each page for the exact gotcha.
- Give a `label` to every field on a settings-style screen — it's the primary way the player knows what a control does, since the modal primitives themselves carry no caption.
