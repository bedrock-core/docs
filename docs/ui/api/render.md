# render

Display a UI component tree to a player.

## Import

```tsx
import { render } from '@bedrock-core/ui';
```

## Signature

```tsx
function render(root: JSX.Element, player: Player): void
```

### Parameters

#### `root`
- Type: `JSX.Element`
- Description: The root component to render

#### `player`
- Type: `Player` (from `@minecraft/server`)
- Description: The player who will see the UI

### Returns

`void`

## Usage

```tsx
import { render, Panel, Text } from '@bedrock-core/ui';
import { world } from '@minecraft/server';

function WelcomeScreen() {
  return (
    <Panel width={400} height={300}>
      <Text x={10} y={10} width={380} height={30} value="Hello, Minecraft!" />
    </Panel>
  );
}

const isPlayer = (source: Entity): source is Player => source.typeId === MinecraftEntityTypes.Player;

// Render it to a player
world.afterEvents.buttonPush.subscribe(({ source }: ButtonPushAfterEvent): void => {
  if (isPlayer(source)) {
    render(<WelcomeScreen />, source);
  }
});
```

## How It Works

1. **Serialization**: Converts the JSX element tree into a compact binary protocol
2. **Form Creation**: Creates an `ActionFormData` from `@minecraft/server-ui`
3. **Payload Injection**: Injects serialized data into the form
4. **Display**: Shows the form to the player
5. **Rendering**: Companion Resource Pack decodes and renders the UI
