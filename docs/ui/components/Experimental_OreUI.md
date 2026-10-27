---
sidebar_position: 4
description: "Experimental player-owned Ore presentation with live controls and version-matched client resources."
---

# Experimental_OreUI

An experimental screen root that presents existing UI components through Ore and a persistent native DDUI form.

## Import

```tsx
import { Experimental_OreUI } from '@bedrock-core/ui';
```

## Usage

```tsx
import { Button, Experimental_OreUI, Panel, Text, useState } from '@bedrock-core/ui';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <Experimental_OreUI title={'Counter'}>
      <Panel width={280} padding={8} gap={8}>
        <Text>{`Count: ${count}`}</Text>
        <Button onPress={() => setCount(value => value + 1)}>
          <Text>{'Add one'}</Text>
        </Button>
      </Panel>
    </Experimental_OreUI>
  );
}
```

Place the component in a `*.screen.tsx` module with a default export. Builder compiles its layout and packages the selected client's resources. Open the compiled screen with `render()` or navigation as described in [Experimental Ore screens](../guides/experimental-ore.md).

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `JSX.Node` | — | Components presented by the host |
| `title` | `string` | — | Title identifying the native backing form |
| `uiScale` | `number` | viewport-based scaling | Fixed pixels per layout unit, greater than zero and at most 16 |

## Notes

The root selects the `experimental-ore-ui` host and belongs to a player. Layout props belong on a child `Panel`. Automatic scaling uses the viewport and does not read Minecraft's GUI-scale setting.

`Input`, `Slider` and `Dropdown` use `value` and `onChange` for live edits. `Toggle` uses `on` and `onChange`; `Select` reports selected option values. These controls do not use a screen-level Submit lifecycle on this host.

## Limits

The current asset target is Windows Minecraft `1.26.60.30`. Client resources, textures and the live-input adapter must match the selected version. Resource resolution and event forwarding depend on undocumented client behavior; build and browser checks do not establish native rendering or input acceptance.

Inventory cells, modal submission and media controls are unsupported. The compiled node structure and root scale must remain stable. See [supported controls and limits](../guides/experimental-ore.md#supported-controls-and-limits).
