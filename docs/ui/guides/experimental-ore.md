---
sidebar_position: 5
description: "Build experimental Ore screens with live controls, matching Windows client assets and explicit host limits."
---

# Experimental Ore screens

Use `Experimental_OreUI` for a player-owned screen whose controls update while its native backing form stays open.

:::caution Experimental client integration
The current asset target is Windows Minecraft `1.26.60.30`. The API requires `@minecraft/server-ui` with `CustomForm` support and matching client resources. The Ore adapter uses undocumented resource resolution and DOM event forwarding. Validate appearance, input and navigation on the exact target client before distribution.
:::

## Author and open a screen

Write a default-exported component in `packs/BP/scripts/screens/counter.screen.tsx`:

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

Builder compiles the screen and installs its generated registrations in the script entry. After building, open it for a player:

```ts
import type { Player } from '@minecraft/server';
import { render } from '@bedrock-core/ui';
import Counter from './screens/counter.screen';

export function openCounter(player: Player) {
  render(Counter, player);
}
```

Navigation keys work through the existing [navigation API](/docs/navigation/guides/getting-started). The screen's JSX, state hooks and callbacks remain owned by the addon.

## Configure client resources

Set `targetVersion` to `1.26.60` in the Builder project. The UI stage selects matching installed client assets, or accepts an explicit `experimentalOre.clientRoot`. Configure the stage inside a profile:

```json title="bedrockCore.profiles.default.stages"
{
  "ui-compiler": {
    "experimentalOre": {
      "clientRoot": "C:/path/to/Minecraft/Content",
      "resourceRoots": ["./ui-assets"],
      "dynamicTextures": ["textures/my_addon/status_ready"]
    }
  }
}
```

`clientRoot` contains the installed client's `appxmanifest.xml` and native resource files. `resourceRoots` lists fallback resource-pack roots; the selected output RP takes priority. These filesystem paths resolve from the project directory. `dynamicTextures` lists pack-local paths under `textures/` that live image callbacks may select.

Builder writes pack-local layouts and adapter resources under `hbui/`, and records the selected version and asset hashes in `bedrock-core/experimental-ore.json`. Installed game files remain read-only. An unresolved texture, unsupported live-input bundle or conflicting authored override fails the build. Projects without Ore screens do not need these resources.

The shared UI texture pack supplies the [styled components](/docs/ore-styled). The selected RP and fallback roots must make their referenced textures available to the Ore build.

## Use live fields

`Input`, `Slider` and `Dropdown` accept controlled `value` and `onChange` props. Without `value`, they retain their own state, initialized by `defaultValue`. Change callbacks may be asynchronous and receive the owning player's UI event as their second argument.

```tsx
import { Experimental_OreUI, Input, Panel, Slider, useState } from '@bedrock-core/ui';

export default function Settings() {
  const [name, setName] = useState('Alex');
  const [volume, setVolume] = useState(5);

  return (
    <Experimental_OreUI title={'Settings'}>
      <Panel width={280} gap={8}>
        <Input value={name} onChange={setName} placeholder={'Name'} />
        <Slider min={0} max={10} value={volume} onChange={setVolume} />
      </Panel>
    </Experimental_OreUI>
  );
}
```

`Dropdown` reports the selected option's string value through `onChange`. A modal `Form` still reports its selected index on submit. `Toggle` uses `on` and `onChange`; single and multiple `Select` controls report their option values. The corresponding ore-styled components retain those contracts.

## Supported controls and limits

The host supports panels, text, images, scrolling, buttons, live fields, local selection controls and resident navigation. State can update values, visibility, styles and geometry of existing nodes. A `List` keeps its compiled topology and changes which reserved rows are visible.

| Limit | Value |
| --- | --- |
| Compiled nodes | 16,384 |
| Buttons | 512 |
| Live fields | 16 |
| `uiScale` | Greater than zero and at most 16 |

These are structural limits. Measure the intended screen on its target device. Adding or removing nodes at runtime, changing field configuration, changing the root scale, inventory cells, modal submission and media controls are unsupported.

## Lifecycle and verification

The runtime preallocates native DDUI controls. Observable state updates the existing backing form; ordinary button handlers and live field callbacks run in the addon's existing UI transaction. Compatible Ore destinations can reuse that form. Dismissal, a different host or a destination requiring more allocation releases it.

This uses the documented [CustomForm API](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-ui/customform?view=minecraft-bedrock-stable) for the backing transport. The HTML presentation and event adapter are experimental client integration.

Build tests establish compilation and resource ownership. Browser tests establish adapter behavior. Native checks must cover opening, pointer and keyboard input, focus, disabled controls, scrolling, live text, hover and pressed faces, repeated navigation, closing and reopening. Capture transitions when checking for flashes; a final screenshot cannot establish that intermediate frames were correct.

## Next steps

- [`Experimental_OreUI`](../components/Experimental_OreUI.md) — root props and host ownership
- [Hosts](./hosts.md) — choose a presentation for each screen
- [UI compilation](/docs/builder/guides/stages#ui-compilation) — stage ownership and resource destinations
