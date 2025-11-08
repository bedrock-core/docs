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
    <Panel width={400} height={300}>
      <Text x={10} y={10} width={380} height={30}>{`Name: ${player.name}`}</Text>
      <Text x={10} y={40} width={380} height={30}>{`Health: ${player.getComponent('health')?.currentValue}`}</Text>
      <Text x={10} y={70} width={380} height={30}>{`Level: ${player.level}`}</Text>
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
    <Panel width={400} height={400}>
      <Text x={10} y={10} width={380} height={30}>Player Stats</Text>
      
      <Text x={10} y={50} width={380} height={30}>{`Name: ${player.name}`}</Text>
      <Text x={10} y={80} width={380} height={30}>{`Health: ${healthComp?.currentValue}/${healthComp?.effectiveMax}`}</Text>
      <Text x={10} y={110} width={380} height={30}>{`Level: ${player.level}`}</Text>
      <Text x={10} y={140} width={380} height={30}>{`Position: ${Math.floor(player.location.x)}, ${Math.floor(player.location.y)}, ${Math.floor(player.location.z)}`}</Text>
    </Panel>
  );
}
```

### Check Player Permissions

```tsx
function AdminPanel() {
  const player = usePlayer();
  const isAdmin = player.commandPermissionLevel === CommandPermissionLevel.Admin;
  
  if (!isAdmin) {
    return (
      <Panel width={300} height={100}>
        <Text x={10} y={10} width={280} height={30}>Access Denied</Text>
      </Panel>
    );
  }
  
  return (
    <Panel width={400} height={300}>
      <Text x={10} y={10} width={380} height={30}>Admin Panel</Text>
      <Button x={10} y={50} width={380} height={40}>
        <Text x={10} y={10} width={360} height={20}>Manage Players</Text>
      </Button>
      <Button x={10} y={100} width={380} height={40}>
        <Text x={10} y={10} width={360} height={20}>Server Settings</Text>
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
    return <Text x={10} y={10} width={300} height={30}>Health unavailable</Text>;
  }
  
  return (
    <Text x={10} y={10} width={300} height={30}>{`Health: ${health.currentValue}/${health.effectiveMax}`}</Text>
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

## Limitations

- Player data is a snapshot at render time
