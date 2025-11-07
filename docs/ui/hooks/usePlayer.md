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

## Usage

```tsx
import { usePlayer } from '@bedrock-core/ui';
import type { Player } from '@minecraft/server';

function PlayerInfo() {
  const player = usePlayer();
  
  return (
    <Panel width={400} height={300}>
      <Text x={10} y={10}>Name: {player.name}</Text>
      <Text x={10} y={40}>Health: {player.getComponent('health')?.currentValue}</Text>
      <Text x={10} y={70}>Level: {player.level}</Text>
    </Panel>
  );
}
```

## Returns

- Type: `Player`
- Description: The Minecraft player object from `@minecraft/server` who is currently viewing the UI

## Examples

### Display Player Stats

```tsx
function StatsDisplay() {
  const player = usePlayer();
  const healthComp = player.getComponent('health');
  
  return (
    <Panel width={400} height={400}>
      <Text x={10} y={10} width={380} height={30} value="Player Stats" />
      
      <Text x={10} y={50} width={380} height={30} value={`Name: ${player.name}`} />
      <Text x={10} y={80} width={380} height={30} value={`Health: ${healthComp?.currentValue}/${healthComp?.effectiveMax}`} />
      <Text x={10} y={110} width={380} height={30} value={`Level: ${player.level}`} />
      <Text x={10} y={140} width={380} height={30} value={`Position: ${Math.floor(player.location.x)}, ${Math.floor(player.location.y)}, ${Math.floor(player.location.z)}`} />
    </Panel>
  );
}
```

### Player Actions

```tsx
function PlayerActions() {
  const player = usePlayer();
  
  const heal = () => {
    const health = player.getComponent('health');
    if (health) {
      health.setCurrentValue(health.effectiveMax);
    }
  };
  
  const feed = () => {
    player.runCommand('effect @s saturation 1 255 true');
  };
  
  const teleportHome = () => {
    player.teleport({ x: 0, y: 100, z: 0 });
  };
  
  return (
    <Panel width={400} height={300}>
      <Button x={10} y={10} width={380} height={40} onPress={heal}>
        <Text x={10} y={10} width={360} height={20} value="Heal" />
      </Button>
      <Button x={10} y={60} width={380} height={40} onPress={feed}>
        <Text x={10} y={10} width={360} height={20} value="Feed" />
      </Button>
      <Button x={10} y={110} width={380} height={40} onPress={teleportHome}>
        <Text x={10} y={10} width={360} height={20} value="Teleport Home" />
      </Button>
    </Panel>
  );
}
```

### Check Player Permissions

```tsx
function AdminPanel() {
  const player = usePlayer();
  const isAdmin = player.hasTag('admin');
  
  if (!isAdmin) {
    return (
      <Panel width={300} height={100}>
        <Text x={10} y={10} width={280} height={30} value="Access Denied" />
      </Panel>
    );
  }
  
  return (
    <Panel width={400} height={300}>
      <Text x={10} y={10} width={380} height={30} value="Admin Panel" />
      <Button x={10} y={50} width={380} height={40}>
        <Text x={10} y={10} width={360} height={20} value="Manage Players" />
      </Button>
      <Button x={10} y={100} width={380} height={40}>
        <Text x={10} y={10} width={360} height={20} value="Server Settings" />
      </Button>
    </Panel>
  );
}
```

### Inventory Display

```tsx
function InventoryDisplay() {
  const player = usePlayer();
  const inventory = player.getComponent('inventory')?.container;
  
  if (!inventory) {
    return <Text x={10} y={10} width={300} height={30} value="No inventory" />;
  }
  
  const items: string[] = [];
  for (let i = 0; i < inventory.size; i++) {
    const item = inventory.getItem(i);
    if (item) {
      items.push(`${item.typeId} x${item.amount}`);
    }
  }
  
  return (
    <Panel width={400} height={500}>
      <Text x={10} y={10} width={380} height={30} value={`Inventory (${items.length} items)`} />
      
      {items.slice(0, 10).map((item, index) => (
        <Text key={index} x={10} y={50 + index * 30} width={380} height={30} value={item} />
      ))}
    </Panel>
  );
}
```

### Give Item to Player

```tsx
function ItemShop() {
  const player = usePlayer();
  
  const buyItem = (itemId: string, amount: number) => {
    const inventory = player.getComponent('inventory')?.container;
    if (inventory) {
      inventory.addItem(new ItemStack(itemId, amount));
      player.sendMessage(`§aYou bought ${amount}x ${itemId}`);
    }
  };
  
  return (
    <Panel width={400} height={400}>
      <Text x={10} y={10} width={380} height={30} value="Item Shop" />
      
      <Button 
        x={10} y={60} width={380} height={40}
        onPress={() => buyItem('minecraft:diamond', 1)}
      >
        <Text x={10} y={10} width={360} height={20} value="Buy Diamond (1)" />
      </Button>
      
      <Button 
        x={10} y={110} width={380} height={40}
        onPress={() => buyItem('minecraft:iron_ingot', 10)}
      >
        <Text x={10} y={10} width={360} height={20} value="Buy Iron Ingot (10)" />
      </Button>
      
      <Button 
        x={10} y={160} width={380} height={40}
        onPress={() => buyItem('minecraft:golden_apple', 1)}
      >
        <Text x={10} y={10} width={360} height={20} value="Buy Golden Apple (1)" />
      </Button>
    </Panel>
  );
}
```

### Player Location Map

```tsx
import { system } from '@minecraft/server';

function LocationMap() {
  const player = usePlayer();
  const [location, setLocation] = useState(player.location);
  
  useEffect(() => {
    const runId = system.runInterval(() => {
      setLocation({ ...player.location });
    }, 20); // Runs every 20 ticks (1 second)
    
    return () => system.clearRun(runId);
  }, [player]);
  
  const dimension = player.dimension.id.replace('minecraft:', '');
  
  return (
    <Panel width={400} height={300}>
      <Text x={10} y={10} width={380} height={30} value="Location" />
      <Text x={10} y={50} width={380} height={30} value={`Dimension: ${dimension}`} />
      <Text x={10} y={80} width={380} height={30} value={`X: ${Math.floor(location.x)}`} />
      <Text x={10} y={110} width={380} height={30} value={`Y: ${Math.floor(location.y)}`} />
      <Text x={10} y={140} width={380} height={30} value={`Z: ${Math.floor(location.z)}`} />
    </Panel>
  );
}
```

### Conditional Content by Player

```tsx
function PersonalizedGreeting() {
  const player = usePlayer();
  const timeOfDay = player.dimension.getTimeOfDay();
  
  const greeting = timeOfDay < 6000 ? 'Good morning' :
                   timeOfDay < 12000 ? 'Good afternoon' :
                   timeOfDay < 18000 ? 'Good evening' :
                   'Good night';
  
  return (
    <Panel width={400} height={200}>
      <Text x={10} y={10} width={380} height={30} value={`${greeting}, ${player.name}!`} />
      <Text x={10} y={50} width={380} height={30} value="Welcome back to the server." />
    </Panel>
  );
}
```

### Player Effects Display

```tsx
function EffectsDisplay() {
  const player = usePlayer();
  const effects = player.getEffects();
  
  return (
    <Panel width={400} height={400}>
      <Text x={10} y={10} width={380} height={30} value="Active Effects" />
      
      {effects.length === 0 ? (
        <Text x={10} y={50} width={380} height={30} value="No active effects" />
      ) : (
        effects.map((effect, index) => (
          <Text key={index} x={10} y={50 + index * 30} width={380} height={30} value={`${effect.typeId} - Level ${effect.amplifier + 1} (${effect.duration}s)`} />
        ))
      )}
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

### Cache Player Data

```tsx
// ✅ Good - cache computed values
function PlayerUI() {
  const player = usePlayer();
  const playerName = player.name; // Cache in variable
  const isAdmin = player.hasTag('admin');
  
  return (
    <>
      <Text x={10} y={10}>{playerName}</Text>
      {isAdmin && <AdminControls />}
    </>
  );
}
```

### Handle Missing Components

```tsx
// ✅ Good - check for null/undefined
function HealthDisplay() {
  const player = usePlayer();
  const health = player.getComponent('health');
  
  if (!health) {
    return <Text x={10} y={10}>Health unavailable</Text>;
  }
  
  return (
    <Text x={10} y={10}>
      Health: {health.currentValue}/{health.effectiveMax}
    </Text>
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

- Player object is only available during render context
- Cannot be called outside of a component function
- Player data is a snapshot at render time (use state/effects for live updates)
