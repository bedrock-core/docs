---
sidebar_position: 6
description: "Discover screens, their host kinds and their public parameter contracts."
---
# Screen registry

The builder registers metadata for every compiled screen, including static action screens, modals and native block/entity screens. [`navigation(core)`](./realm.md) publishes this metadata with the current realm as owner and includes drawable static references.

## Import

```ts
import { navigation, type ScreenDescriptor, type ScreenParameters, type OwnedScreen, type ScreensRegistry } from '@bedrock-core/navigation/core';
```

## Lookup

```ts
const { screens } = navigation(core);

screens.all();                       // All published screens and their owners.
screens.all('shop');                 // Screens published by this realm.
screens.get('shop_ui:detail');        // Exact key; undefined if absent or ambiguous.
screens.find('shop', 'detail');       // Owner and screen name; UI namespace may differ.
screens.reference('shop_ui:guide');   // A static reference, when one exists.
```

| Method | Result |
| --- | --- |
| `all(owner?)` | Metadata for all known screens, optionally limited to a publishing realm |
| `get(key)` | One exact-key match, or `undefined` if absent or ambiguous |
| `find(owner, name)` | One screen whose final key segment matches `name` in that realm, or `undefined` |
| `reference(key)` | The screen's portable static data, or `undefined` if it needs its owner's code |

`OwnedScreen` extends `ScreenDescriptor` with an `owner`:

```ts
interface ScreenDescriptor {
  readonly key: string;
  readonly kind: 'action' | 'modal' | 'block' | 'entity' | 'custom';
  readonly parameters?: ScreenParameters;
}

interface OwnedScreen extends ScreenDescriptor {
  readonly owner: string;
}
```

The owner is the publishing Core realm. The UI namespace in a key can differ from that realm's id. Use `find(owner, name)` to discover its actual key instead of constructing one from the owner id.

Local metadata is available immediately after the generated registrations run. Foreign metadata is read synchronously from Core's replicated mirror, so a peer can be absent until its announcement arrives. Lookups return copies of their data. Duplicate keys are ambiguous even when the publishers have different realm ids.

A registry entry describes a destination; it does not make a native container programmatically openable. Use [`register()`](./realm.md#register-a-host-entry-point) to add an entry point with an opener. Catalog manifest-page publishing belongs to [`@bedrock-core/catalog/integration`](/docs/catalog/page).

## Local metadata without Core

```ts
import { screenMetadata, screenMetadataFor } from '@bedrock-core/ui-runtime';

screenMetadata();                   // This bundle's registered metadata.
screenMetadataFor('shop_ui:detail'); // Exact key.
screenMetadataFor('detail');         // Unambiguous local bare name.
```

These functions read build registrations only. They do not discover another realm.

## Declare accepted parameters

A screen module can export a portable runtime contract:

```tsx title="detail.screen.tsx"
import { Panel, Screen, Text, type JSX } from '@bedrock-core/ui';
import type { ScreenParameters } from '@bedrock-core/ui-runtime';

export const parameters = {
  itemId: { type: 'string' },
  section: { type: 'string', enum: ['info', 'offers'], optional: true },
} as const satisfies ScreenParameters;

interface DetailProps {
  itemId: string;
  section?: 'info' | 'offers';
}

export default function Detail({ itemId = 'diamond', section = 'info' }: DetailProps): JSX.Element {
  return (
    <Screen>
      <Panel gap={8}>
        <Text maxLength={64}>{itemId}</Text>
        <Text maxLength={16}>{section}</Text>
      </Panel>
    </Screen>
  );
}
```

Open it with `navigate('shop_ui:detail', player, { params: { itemId: 'diamond', section: 'offers' } })`, using the namespace configured for that build.

For a module whose default export is a record of screens, `parameters` is a record of contracts keyed by the same screen names. Parameterized screens retain their component even when their default rendering could be described as static.

| Parameter type | Contract fields |
| --- | --- |
| `string`, `number` | Optional `enum` of values of that type |
| `boolean` | Boolean value |
| `data` | Any JSON-safe value |
| `array` | Required `items` contract |
| `object` | Required `properties` record of contracts |

Every parameter is required unless `optional: true` is specified. An optional parameter may be omitted; defaults are supplied by the component or host, not by the contract. Objects reject undeclared properties, including inside nested object contracts. All values must be plain JSON data, including finite numbers. Invalid inputs reject the transition rather than being dropped.

An empty contract accepts no parameters. An absent contract accepts plain-data parameters without a named-property restriction; TypeScript props alone do not create runtime metadata. Static references accept no parameters.

## Compiled references

A data-only screen record contains its compiled title, entry values and declarative press actions. The builder registers these records through the renderer's `registerStaticScreens()` API. `navigate()` can open them without a component or a Core runtime.

Core publishes drawable records alongside screen metadata. It presents a reference locally when possible and contacts the owning realm when a destination needs its code. Caller history remains owned by the navigation library.
