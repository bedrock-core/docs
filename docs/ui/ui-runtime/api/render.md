# render

Display a UI component tree to a player.

## Import

```tsx
import { render } from '@bedrock-core/ui';
```

## Signature

```tsx
function render(root: FunctionComponent | JSX.Element, player: Player): void
```

### Parameters

#### `root`
- Type: `FunctionComponent | JSX.Element`
- Description: The root component or element to render

#### `player`
- Type: `Player` (from `@minecraft/server`)
- Description: The player who will see the UI

### Scrolls

Content renders into a single full-screen **root scroll** by default — no extra setup, it scrolls when it overflows the viewport. For multiple independent scroll regions (columns or rows, up to 4), compose [`<Scroll>`](../components/Scroll.md) components.

### Returns

`void`

## Usage

```tsx
import { render, Panel, Text } from '@bedrock-core/ui';
import { world } from '@minecraft/server';

function WelcomeScreen() {
  return (
    <Panel padding={10}>
      <Text>{'Hello, Minecraft!'}</Text>
    </Panel>
  );
}

const isPlayer = (source: Entity): source is Player => source.typeId === MinecraftEntityTypes.Player;

// Render it to a player
world.afterEvents.buttonPush.subscribe(({ source }: ButtonPushAfterEvent): void => {
  if (isPlayer(source)) {
    render(WelcomeScreen, source);
  }
});
```

## How It Works

1. **Serialization**: Converts the JSX element tree into a compact binary protocol
2. **Form Creation**: Creates an `ActionFormData` from `@minecraft/server-ui`
3. **Payload Injection**: Injects serialized data into the form
4. **Display**: Shows the form to the player
5. **Rendering**: Companion Resource Pack decodes and renders the UI
