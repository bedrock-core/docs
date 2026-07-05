---
sidebar_position: 20
---
# Form.Button

Themed submit/exit action button for use inside an ore-styled [`Form`](./Form.md).

![FormButton](/img/ore-styled/FormButton.png)

## Import

```tsx
import { Form } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<Panel flexDirection={'row'} gap={4}>
  <Form.Button type={'submit'} label={'Save'} flex={2} />
  <Form.Button type={'exit'} label={'Cancel'} variant={'danger'} flex={1} />
</Panel>
```

Built on top of the runtime [`Form.Button`](../ui-runtime/components/FormButton.md) primitive and the [theme](./theme.md) token map. The label rides the modal's title payload as plain text, so only the variant's **color** applies to it — the RP renders the label with its own fixed font, so the variant's font/scale can't reach it.

## Props

### Component-Specific Props

#### `type` (required)
- Type: `'submit' | 'exit'`
- Description: `'submit'` presses the native submit; `'exit'` closes the form like Esc. A form must declare exactly one submit button and at most one exit button — see [`Form`'s Rules & Restrictions](./Form.md#rules--restrictions).

#### `variant`
- Type: `ButtonVariant` (`'hero' | 'primary' | 'secondary' | 'contrast' | 'danger' | 'realm' | 'transparent'`)
- Default: `'primary'` for `type="submit"`, `'secondary'` for `type="exit"`
- Description: Visual style, same variant set as the ore-styled [`Button`](./Button.md).

#### `label`
- Type: `string`
- Default: `'Submit'` for `type="submit"`, `'Close'` for `type="exit"`
- Description: Button text.

#### `enabled`
- Type: `boolean`
- Default: `true`
- Description: Whether the button is interactive.

### Control Props

`Form.Button` inherits all standard [control props](../ui-runtime/components/control-props.md).

## Examples

### Submit + exit pair with a destructive exit style

```tsx
<Panel flexDirection={'row'} gap={4} padding={4}>
  <Form.Button type={'submit'} label={'Save'} flex={2} />
  <Form.Button type={'exit'} label={'Cancel'} variant={'danger'} flex={1} />
</Panel>
```

## Best Practices

- Keep the default variants (`primary` submit / `secondary` exit) unless there's a good reason to deviate — e.g. a `danger` exit when cancelling discards meaningful progress.
- Give the submit button an actionable label ("Save", not the generic default "Submit").
