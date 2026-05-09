---
sidebar_position: 5
---
# Image

Display images and textures in your UI.

## Import

```tsx
import { Image } from '@bedrock-core/ui';
```

## Usage

```tsx
<Image width={64} height={64} texture={'textures/ui/my_icon'} />
```

Unlike `Text` and `Button`, `Image` is **not** intrinsically sized — you must provide `width` and `height` (or flex props) to give it a footprint.

## Props

### Component-Specific Props

#### `texture`
- Type: `string`
- Required: Yes
- Description: Path to the texture in your Resource Pack (without file extension).

### Control Props

Image inherits all standard [control props](./control-props.md).

## Examples

### Basic Image

```tsx
<Image width={100} height={100} texture={'textures/ui/my_image'} />
```

### Image Gallery

```tsx
function ImageGallery() {
  const images = [
    'textures/items/diamond',
    'textures/items/gold_ingot',
    'textures/items/iron_ingot',
    'textures/items/emerald',
  ];

  return (
    <Panel flexDirection={'row'} padding={10} gap={6}>
      {images.map((texture, index) => (
        <Image
          key={index}
          width={32}
          height={32}
          texture={texture}
        />
      ))}
    </Panel>
  );
}
```

### Clickable Image Button

```tsx
function ImageButton() {
  return (
    <Button onPress={() => console.log('Image clicked')}>
      <Image width={32} height={32} texture={'textures/ui/icon'} />
    </Button>
  );
}
```

## Texture Path Format

Texture paths should:
- Be relative to your Resource Pack root.
- Omit file extensions (`.png`, `.jpg`).
- Use forward slashes (`/`) as path separators.
- Match exactly the path structure in your Resource Pack.

Example Resource Pack structure:

```
packs/RP/
└── textures/
    └── ui/
        ├── icons/
        │   ├── health.png
        │   └── mana.png
        └── backgrounds/
            └── panel_bg.png
```

Usage:

```tsx
<Image width={16} height={16} texture={'textures/ui/icons/health'} />
<Image width={200} height={120} texture={'textures/ui/backgrounds/panel_bg'} />
```

## Best Practices

- Prefer nine-sliced textures for scaling backgrounds.
- Keep texture file sizes small to reduce pack size.
- Organize textures in logical folders within `textures/ui/`.
- Match texture dimensions to your UI footprint for crisp rendering.

## Limitations

- Animated textures (flipbook) not yet supported.
- Maximum texture path length determined by serialization protocol (80 bytes).
