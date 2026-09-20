---
sidebar_position: 8
description: "Extend the UI with composed components and understand the boundary around native controls."
---

# Extending components

Build reusable addon components by composing the controls exported from `@bedrock-core/ui` and `@bedrock-core/ui/ore-styled`.

## Compose public components

A function component can own props, state and layout while returning supported controls. It remains compatible with every host that supports those controls and needs no resource-pack registration.

```tsx
import { Panel, Text, type FunctionComponent, type JSX } from '@bedrock-core/ui';

interface RatingProps {
  value: number;
}

const Rating: FunctionComponent<RatingProps> = ({ value }): JSX.Element => (
  <Panel flexDirection={'row'} gap={2}>
    <Text>{'Rating'}</Text>
    <Text maxLength={5}>{`${value}/5`}</Text>
  </Panel>
);
```

Keep the returned tree within the rules of its host. A screen uses one [`<Screen>`](../components/Screen.md), a modal uses one [`<Form>`](../components/Form.md), and a container layout uses one [`<Container>`](../components/Container.md) at its root.

## Embed another addon's area

Use [`<Embed>`](../components/Embed.md) when one addon owns a compiled area that another addon's screen reserves. The embedded component is still made from public controls; its owner compiles and publishes the screen reference.

## Native control boundary

Addon code cannot register a new host-element type for the compiled-screen pipeline. A native control needs matching behavior in the runtime tree, the UI compiler, each supported host and the shared render pack. Registering a serializer or adding JSON UI in one addon does not establish that contract for other addons.

The runtime exports a few low-level descriptor and writer types for framework packages. They are implementation interfaces rather than an addon extension point. Add a new native control to the framework packages and their tests together when composition cannot express the required behavior.

## Next steps

- [Components](../components/components.md) — controls available for composition
- [Hosts](./hosts.md) — rules and capabilities of each screen host
- [`Embed`](../components/Embed.md) — reserve and fill an area across addon packs
