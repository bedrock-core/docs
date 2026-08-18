---
sidebar_position: 6
---
# Background

Draw a full-screen texture behind everything in a form.

## Import

```tsx
import { Background } from '@bedrock-core/ui';
```

## Usage

```tsx
<>
  <Background texture={'textures/ui/my_background'} />
  <Text>{'Hello'}</Text>
</>
```

`Background` occupies no layout space — it takes no width/height, participates in no flexbox flow, and is invisible to its siblings. It simply renders the given texture across the whole screen, behind all other form content.

Place one anywhere in the tree (conventionally first, at the root). It works on both backends — a plain `ActionForm` tree and inside a [`<Form>`](./Form/Form.md) modal.

:::note Only the first `<Background>` wins
If a tree contains more than one `<Background>`, only the first is rendered; the rest are ignored.
:::

## Props

### Component-Specific Props

#### `texture`
- Type: `string`
- Required: yes
- Description: Resource-pack texture path drawn as the full-screen backdrop, e.g. `'textures/ui/my_background'`.
- Constraints: The path must fit within 80 UTF-8 bytes and may not contain a `;` character.

## Examples

### Full-screen backdrop for a form

```tsx
import { Background, Form, Text } from '@bedrock-core/ui';

function Settings({ onSubmit }) {
  return (
    <Form onSubmit={onSubmit}>
      <Background texture={'textures/ui/dialog_background_hollow_4_thin'} />

      <Text>{'§lSettings'}</Text>
      <Text>{'Music'}</Text>
      <Form.Toggle name={'music'} />
      <Form.Input name={'nickname'} />
      <Form.Button type={'submit'} label={'Save'} />
    </Form>
  );
}
```

### Backdrop behind an action-form screen

```tsx
import { Background, Button, Panel, Text } from '@bedrock-core/ui';

function Menu() {
  return (
    <>
      <Background texture={'textures/ui/my_menu_background'} />

      <Panel padding={12} gap={8}>
        <Text>{'§lMain Menu'}</Text>
        <Button onPress={play}>
          <Text>{'Play'}</Text>
        </Button>
      </Panel>
    </>
  );
}
```

## Limitations

- The texture path is capped at 80 UTF-8 bytes and cannot contain `;`.
- Only the first `<Background>` in a tree is drawn.
- The texture always covers the entire screen — there is no partial or positioned mode. For a bounded background, use a [`<Panel>`](./Panel.md) or [`<Image>`](./Image.md) instead.
