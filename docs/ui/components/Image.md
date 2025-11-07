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
<Image 
  x={10} 
  y={10}
  width={64}
  height={64}
  texture="textures/ui/my_icon"
/>
```

## Props

### Component-Specific Props

#### `texture`
- Type: `string`
- Required: Yes
- Description: Path to the texture in your Resource Pack (without file extension)

### Control Props

Image inherits all standard [control props](./control-props.md).

## Examples

### Basic Image

```tsx
<Image 
  x={0} 
  y={0}
  width={100}
  height={100}
  texture="textures/ui/my_image"
/>
```

### Image Gallery

```tsx
function ImageGallery() {
  const images = [
    'textures/items/diamond',
    'textures/items/gold_ingot',
    'textures/items/iron_ingot',
    'textures/items/emerald'
  ];
  
  return (
    <Panel width={300} height={100}>
      {images.map((texture, index) => (
        <Image
          key={index}
          x={10 + (index * 70)}
          y={10}
          width={64}
          height={64}
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
    <Button
      x={10}
      y={10}
      width={64}
      height={64}
      onPress={() => console.log('Image clicked')}
    >
      <Image
        x={0}
        y={0}
        width={64}
        height={64}
        texture="textures/ui/icon"
      />
    </Button>
  );
}
```

## Texture Path Format

Texture paths should:
- Be relative to your Resource Pack root
- Omit file extensions (`.png`, `.jpg`)
- Use forward slashes (`/`) as path separators
- Match exactly the path structure in your Resource Pack

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
<Image texture="textures/ui/icons/health" />
<Image texture="textures/ui/backgrounds/panel_bg" />
```

## Best Practices

- Prefer nine-sliced textures for scaling textures
- Keep texture file sizes small to reduce pack size
- Organize textures in logical folders within `textures/ui/`
- Match texture dimensions to your UI layout for crisp rendering

## Limitations

- Animated textures (flipbook) not yet supported (not event tested)
- Maximum texture length determined by serialization protocol (32 bytes)
