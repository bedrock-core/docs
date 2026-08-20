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

Content renders into a single full-screen **root scroll** by default — no extra setup, it scrolls when it overflows the viewport. For multiple independent scroll regions (columns or rows, up to 2), compose [`<Scroll>`](../components/Scroll.md) components.

### Returns

`void`

## One UI slot per player

Each player has a single live UI session. Calling `render()` while one is already running does **not** stack a second one — it swaps the new tree into the running session:

- The old tree unmounts first: its effect cleanups run, its hook state is discarded, and any form it has on screen is closed programmatically (that close is not treated as the player dismissing — a modal's `onCancel` does not fire for it).
- The input lock is carried over, so the camera never flashes free between screens.
- The new tree then presents with fresh, mount-phase state.

This makes cross-app handoff safe from a button press — no [`useExit`](../hooks/useExit.md) call needed, the swap replaces the running UI by itself:

```tsx
function SettingsButton() {
  const player = usePlayer();

  return (
    <Button onPress={() => render(SettingsApp, player)}>
      <Text>{'Settings'}</Text>
    </Button>
  );
}
```

When the handoff goes through an async opener (a prefetch, an RPC), **return the promise from `onPress`** so the swap lands inside the press's transaction — deterministic and flash-free. Fired-and-forgotten it still converges; worst case the screen re-locks for a frame.

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
