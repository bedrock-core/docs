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

### Display Player Stats

```tsx
function StatsDisplay() {
  const player = usePlayer();
  const healthComp = player.getComponent('health');

  return (
    <Panel padding={10} gap={4}>
      <Text>{'§lPlayer Stats'}</Text>
      <Text>{`Name: ${player.name}`}</Text>
      <Text>{`Health: ${healthComp?.currentValue}/${healthComp?.effectiveMax}`}</Text>
      <Text>{`Level: ${player.level}`}</Text>
      <Text>{`Position: ${Math.floor(player.location.x)}, ${Math.floor(player.location.y)}, ${Math.floor(player.location.z)}`}</Text>
    </Panel>
  );
}
```

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

## Use Cases

1. **Display Player Information** - Name, level, health, location
2. **Player-specific Actions** - Teleport, heal, give items
3. **Permission Checks** - Admin panels, role-based features
4. **Inventory Management** - View or modify player inventory
5. **Personalization** - Customize UI based on player data
6. **Player Commands** - Execute commands as the player

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
