---
description: "A form field's caption, colored by enabled state, for a control of your own."
---
# fieldLabel

A form field's caption, colored by enabled state.

## Import

```tsx
import { fieldLabel } from '@bedrock-core/ore-styled';
```

## Signature

```ts
function fieldLabel(label: string, enabled: boolean): JSX.Element
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `label`<Req /> | `string` | — | The caption text |
| `enabled`<Req /> | `boolean` | — | Whether the control it labels accepts input |

## Returns

`JSX.Element` — a `Text` in the theme's field-label style, colored for the enabled state.

## Usage

```tsx
fieldLabel('Volume', true);
```

The runtime's own fields — `Toggle`, `Slider`, `Dropdown`, `Input` — are deliberately label-free. Every themed field in this package composes its caption with `fieldLabel` when given a `label` prop; reach for it directly only when styling a control of your own.

## Examples

### A custom labeled field

```tsx
function RatingField({ label, enabled, stars }: { label: string; enabled: boolean; stars: number }): JSX.Element {
  return (
    <Panel flexDirection={'column'} gap={4}>
      {fieldLabel(label, enabled)}
      <Rating stars={stars} />
    </Panel>
  );
}
```

## Notes

A literal `label` carries the theme's enabled or disabled color as a `§` prefix. A string the active [translation resolver](/docs/ui/hooks/useTranslationResolver) recognizes as a `.lang` key passes through untouched instead — a `§` prefix in front of a key would stop it resolving, the same rule [`MenuRow`](./MenuRow.md) follows for its own text. Bake the color codes into the translation itself when a localized caption needs them.

Reads `theme.components.form.labelStyle` for its font, scale, color and boldness — see [theme](./theme.md).
