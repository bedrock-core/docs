# render

Display a UI component tree to a player.

## Import

```tsx
import { render, Screen } from '@bedrock-core/ui';
```

## Signature

```tsx
function render(root: FunctionComponent | JSX.Element, player: Player, screen: ScreenDescriptor): void
```

### Parameters

#### `root`
- Type: `FunctionComponent | JSX.Element`
- Description: The root component or element to render

#### `player`
- Type: `Player` (from `@minecraft/server`)
- Description: The player who will see the UI

#### `screen`
- Type: `ScreenDescriptor`
- Description: Which RP screen layout to activate. This is the **baseline** for the whole render — it sets the JSON UI layout. Pass one of the built-in descriptors:
  - `Screen.Scroll` — default scrolling form (the only built-in type today; the descriptor system is kept so more screen types can be added later).

  A component deeper in the tree can override the baseline for one build with the [`useSetScreen`](../hooks/useSetScreen.md) hook.

**`Screen` type:**

```ts
interface ScreenDescriptor {
  readonly type: 'scroll';
}

const Screen = {
  Scroll: { type: 'scroll' },
} as const;
```

### Returns

`void`

## Usage

```tsx
import { render, Screen, Panel, Text } from '@bedrock-core/ui';
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
    render(WelcomeScreen, source, Screen.Scroll);
  }
});
```

## How It Works

1. **Serialization**: Converts the JSX element tree into a compact binary protocol
2. **Form Creation**: Creates an `ActionFormData` from `@minecraft/server-ui`
3. **Payload Injection**: Injects serialized data into the form
4. **Display**: Shows the form to the player
5. **Rendering**: Companion Resource Pack decodes and renders the UI
