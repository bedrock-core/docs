---
sidebar_position: 8
---
# usePlayer

Access the current player who is viewing the UI.

## Import

```tsx
import { usePlayer } from '@bedrock-core/ui';
```

## Signature

```tsx
function usePlayer(): Player
```

### Parameters

None

### Returns

- Type: `Player`
- Description: The Minecraft player object from `@minecraft/server` who is currently viewing the UI

## Usage

```tsx
import { usePlayer } from '@bedrock-core/ui';

function PlayerInfo() {
  const player = usePlayer();

  return (
    <Panel padding={10} gap={4}>
      <Text>{`Name: ${player.name}`}</Text>
      <Text>{`Health: ${player.getComponent('health')?.currentValue}`}</Text>
      <Text>{`Level: ${player.level}`}</Text>
    </Panel>
  );
}
```

## Examples

### Check Player Permissions

```tsx
import { CommandPermissionLevel } from '@minecraft/server';

function AdminPanel() {
  const player = usePlayer();
  const isAdmin = player.commandPermissionLevel === CommandPermissionLevel.Admin;

  if (!isAdmin) {
    return (
      <Panel padding={10}>
        <Text>{'§cAccess Denied'}</Text>
      </Panel>
    );
  }

  return (
    <Panel padding={10} gap={8}>
      <Text>{'§lAdmin Panel'}</Text>
      <Button>
        <Text>{'Manage Players'}</Text>
      </Button>
      <Button>
        <Text>{'Server Settings'}</Text>
      </Button>
    </Panel>
  );
}
```

## Best Practices

### Handle Missing Components

```tsx
// ✅ Good - check for null/undefined
function HealthDisplay() {
  const player = usePlayer();
  const health = player.getComponent('health');

  if (!health) {
    return (
      <Panel padding={10}>
        <Text>{'Health unavailable'}</Text>
      </Panel>
    );
  }

  return (
    <Panel padding={10}>
      <Text>{`Health: ${health.currentValue}/${health.effectiveMax}`}</Text>
    </Panel>
  );
}
```

### Don't Store Player in State

```tsx
// ❌ Bad - storing player in state
const [playerState, setPlayerState] = useState(usePlayer());

// ✅ Good - use player directly
const player = usePlayer();
```
