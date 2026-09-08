---
sidebar_position: 1
description: "@bedrock-core/ui renders through Minecraft's own server forms: the runtime serializes each component's props into a byte-addressed payload string, and the…"
---

# Render pack

`@bedrock-core/ui` renders through Minecraft's own server forms: the runtime serializes each component's props into a byte-addressed payload string, and the **render pack** decodes those bytes with JSON UI bindings and draws the screen. That wire format is versioned.

This release ships **protocol v0008**.

:::danger Existing projects must update the render pack
The protocol version is a hard gate, not a negotiation. A behavior pack emitting `bcuiv0008` payloads into a world running an older render pack renders **nothing** — the pack's decoders match on the header and drop everything else. Update the pack before (or with) the library.
:::

## Getting the matching pack

The render pack ships as the `core-ui-v*.mcpack` attached to each `@bedrock-core/ui` release, and the [CLI](/docs/cli) downloads the latest one into new projects automatically. **Take the pack from the same release as the library** — that pairing is the compatibility contract.

Its UUID never changes — `761ecd37-ad1c-4a64-862a-d6cc38767426` — so the dependency entry in your behavior pack's `manifest.json` stays as it is:

```json
{
  "dependencies": [
    {
      "uuid": "761ecd37-ad1c-4a64-862a-d6cc38767426",
      "version": [1, 10, 0]
    }
  ]
}
```

### Which pack goes with which release

The pack's version tracks the **library release it ships in**: pack `1.10.x` belongs to `@bedrock-core/ui` `0.10.x`. Match the minor and you have the right pack.

| Pack version | Library | Protocol |
| --- | --- | --- |
| `1.10.x` | `0.10.x` | `v0008` |

The protocol is not encoded in the version. To read a pack's protocol directly, look at its description in the in-game pack list: *"by DrAv0011 — protocol v0008"*.

Ship the pack alongside your own, exactly as described in [Installation](../installation.md).

:::caution One pack, one world
The render pack is world-scoped and shared by every addon in the world that uses `@bedrock-core/ui`. Whichever copy the world loads is the one every addon decodes against, so a world mixing addons built for different protocol versions can only satisfy one of them. Keep the framework version aligned across the addons you ship together.

The pack decodes only payloads carrying its own header, so an addon on a different protocol falls through to the **plain vanilla form** (its payload rendered as raw text) rather than being decoded at the wrong offsets. Visibly broken for that one addon; nothing else in the world is affected.
:::

## How to tell which version you are emitting

The header is the first nine bytes of every payload the runtime writes. `serializer.ts` holds it as two constants:

```ts
export const VERSION = 'v0008';
export const PROTOCOL_HEADER = `bcui${VERSION}`;   // 'bcuiv0008'
export const PROTOCOL_HEADER_LENGTH = 9;           // bytes, all single-byte ASCII
```

The resource pack carries the same string as `$protocol_header` in its JSON UI definitions. If a screen opens completely blank while the script log shows no error, mismatched headers are the first thing to check.

## Text and textures travel as a tail

A payload is a sequence of fixed-width fields — every string occupies 83 bytes (`s:` prefix, 80 bytes of content, a 1-byte uniqueness marker) — followed, for terminal cells, by one **variable-length tail**: unpadded, unprefixed, uncapped. A `Text` cell's tail is its text; an `Image` cell's tail is its `texture` path. Everything before the tail decodes at fixed offsets; the tail is the rest.

A key and a literal share that wire format, both read by a `localize: true` label, so `Text` has one text channel:

```tsx
<Text>{'Short literal'}</Text>                          {/* paints literally */}
<Text>{key($ => $.shop.title)}</Text>                   {/* resolver knows it → localized */}
<Text>{raw($ => $.shop.bought, { item, price })}</Text> {/* RawMessage → client resolves */}
```

`children` is `DisplayText` (`string | RawMessage`). A string is auto-detected: if the active resolver knows it as a key, it is localized; otherwise it paints literally, which is what Bedrock does with an unmatched `.lang` key. A `RawMessage` with arguments travels as a rawtext pair, `[{ text: <fixed fields> }, <tail>]`, and the client resolves and fills it: its own language, no length cap, `score` / `selector` parts included. Every other string field in a payload (`Background` and state textures, fonts, form labels routed through native channels) is a fixed 83-byte field with an 80-byte content budget, and exceeding it throws a `SerializationError` at serialize time.

See [`Text`](../components/Text.md) for the component and [i18n](/docs/i18n) for where `key()` / `raw()` come from.

`fontType` is a common control field so the merged label cell, which mounts for every cell type, decodes a valid font alias at a fixed offset whatever the cell is — non-text components carry `'default'`. `#font_type` is engine-reserved and validated the moment it is written, so a texture path in that slot would log a `Could not find font alias` line per cell to `NonAssertErrorLog`, which blocks Marketplace submission.

## The control block

```txt
[0-8]:      Protocol header          (9 bytes, 'bcuiv0008')
[9-91]:     type                     (string, 83 bytes)
[92-174]:   width                    (number, 83) — computed by the layout engine
[175-257]:  height                   (number, 83) — computed by the layout engine
[258-340]:  x                        (number, 83) — computed by the layout engine
[341-423]:  y                        (number, 83) — computed by the layout engine
[424-431]:  visible                  (bool, 8)
[432-439]:  enabled                  (bool, 8)
[440-522]:  background               (string, 83)
[523-605]:  region                   (number, 83) — scroll index this element belongs to
[606-688]:  fontType                 (string, 83) — the cell's font alias
[689-1023]: Reserved                 (335 bytes)
[1024-]:    Component-specific fields
```

For an `Image` cell the component-specific region is just the texture tail. For a `Text` cell it carries the label group: `labelFontType`, `fontScaleFactor`, `labelX` `[1190]`, `labelY` `[1273]`, and the text tail. `labelFontType` stays in the group even though the cell label sources `[606]`, so every sub-element group reads its own slot 1 at the same offset.

:::tip Custom native components are unaffected
Fields you define in a [custom native component](./custom-native-components.md) start at `[1024]`. Common fields such as `region` and `fontType` are carved from the reserved block so that offset never moves; a resource pack decoding a custom component at a fixed offset from 1024 keeps working across render-pack releases.
:::

