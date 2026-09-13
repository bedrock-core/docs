---
sidebar_position: 2
description: "A texture from a resource pack, baked into the screen or carried at runtime."
---
# Image

A texture from a resource pack.

## Import

```tsx
import { Image } from '@bedrock-core/ui';
```

## Usage

```tsx
<Image width={64} height={64} texture={'textures/ui/my_icon'} />
```

Unlike `Text` and `Button`, `Image` is **not** intrinsically sized — give it `width` and `height`, or flex props, or it has no footprint.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `texture` | `string` | `'textures/ui/unstyled'` | Path to the texture in the resource pack, without the file extension |
| `live` | `boolean` | `false` | Carry the texture path at runtime rather than baking it |

Inherits [control props](../control-props.md). The default is the blank-canvas placeholder, so an `Image` with no `texture` draws a plain box.

## live

A compiled image is **baked**: the path is written into the pack, and a later render showing another texture is silently wrong. `live` is how an image whose texture changes says so.

```tsx
<Image live width={16} height={16} texture={iconFor(state)} />
```

It costs one entry on a form. Leave it off for a texture that never changes, which is every decorative image.

## Texture paths

A path is relative to the resource pack root, omits the file extension, and uses forward slashes.

```txt
packs/RP/
└── textures/
    └── ui/
        ├── icons/
        │   ├── health.png
        │   └── mana.png
        └── backgrounds/
            └── panel_bg.png
```

```tsx
<Image width={16} height={16} texture={'textures/ui/icons/health'} />
<Image width={200} height={120} texture={'textures/ui/backgrounds/panel_bg'} />
```

Paths are any length: the texture rides the payload's variable-length tail, so it is never padded, truncated or capped.

## Examples

### A row of icons

```tsx
function Icons(): JSX.Element {
  const items = ['diamond', 'gold_ingot', 'iron_ingot', 'emerald'];

  return (
    <Panel flexDirection={'row'} padding={10} gap={6}>
      {items.map(item => (
        <Image key={item} width={32} height={32} texture={`textures/items/${item}`} />
      ))}
    </Panel>
  );
}
```

### An icon that presses

```tsx
<Button action={() => console.warn('pressed')}>
  <Image width={32} height={32} texture={'textures/ui/icon'} />
</Button>
```

## Notes

Prefer nine-sliced textures for backgrounds that scale, keep file sizes small, and match texture dimensions to the UI footprint for crisp rendering.

## Limits

Animated (flipbook) textures are not supported.
