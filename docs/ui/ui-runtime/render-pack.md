---
sidebar_position: 4
---

# Render pack

`@bedrock-core/ui` renders through Minecraft's own server forms: the runtime serializes each component's props into a byte-addressed payload string, and the **render pack** decodes those bytes with JSON UI bindings and draws the screen. That wire format is versioned.

This release ships **protocol v0008**.

:::danger Existing projects must update the render pack
The protocol version is a hard gate, not a negotiation. A behavior pack emitting `bcuiv0008` payloads into a world running an older render pack renders **nothing** — the pack's decoders match on the header and drop everything else. Update the pack before (or with) the library.
:::

## Getting the matching pack

The render pack ships as the `core-ui-v*.mcpack` attached to each `@bedrock-core/ui` release, and the [CLI](../cli.md) downloads the latest one into new projects automatically. **Take the pack from the same release as the library** — that pairing is the compatibility contract.

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

Ship the pack alongside your own, exactly as described in [Installation](../get-started/installation.md).

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

## What changed in v0008

Three changes, all breaking.

### 1. Text is one channel, with an uncapped tail

Before v0008, a payload was a sequence of **fixed-width** fields: every string occupied 83 bytes (`s:` prefix + 80 bytes of content + a 1-byte uniqueness marker), which capped any rendered text at 80 UTF-8 bytes. Longer copy had to go through a separate `localizationKey` prop that shipped a `.lang` key instead of the text.

v0008 reorders the label field group to `[fontType, fontScale, x, y, text]` — **text last** — and makes the text of terminal payloads a **variable-length tail**: unpadded, unprefixed, uncapped. Everything before the tail still decodes at fixed offsets; the tail is simply "the rest".

Because a key and a literal now share one wire format (both read by a `localize: true` label), there is nothing left to declare. `Text` has **one** text channel:

```tsx
// v0007 and earlier — REMOVED
<Text localizationKey={'drav0011_shop.shop.title'} />
<Text>{'Short literal'}</Text>

// v0008
<Text>{'Short literal'}</Text>                          {/* paints literally */}
<Text>{key($ => $.shop.title)}</Text>                   {/* resolver knows it → localized */}
<Text>{raw($ => $.shop.bought, { item, price })}</Text> {/* RawMessage → client resolves */}
```

`children` is now `DisplayText` (`string | RawMessage`). A string is **auto-detected**: if the active resolver knows it as a key, it is localized; otherwise it paints literally — which is exactly what Bedrock does with an unmatched `.lang` key. A `RawMessage` with arguments travels as a rawtext pair, `[{ text: <fixed fields> }, <tail>]`, and the **client** resolves and fills it: its own language, no length cap, `score`/`selector` parts included.

See [`Text`](./components/Text.md) for the component and [i18n](../i18n/i18n.md) for where `key()` / `raw()` come from.

### 2. A common `fontType` field at `[606-688]`

The merged label cell mounts for **every** cell type, so its label decoded the font slot whatever the cell actually was. Read from the component-specific region at `[1024]`, that slot was an image's `texture` or a button's `backgroundHover` — and `#font_type` is engine-reserved, so the alias is validated the moment it is written. Opening a form logged one `Could not find font alias textures/…` line per image, divider and button to `NonAssertErrorLog`, which blocks Marketplace submission.

`fontType` is now a **common control field**, carved out of the reserved block (418 → 335 bytes) the same way `region` was in v0006. Every component carries a valid alias at a fixed offset — non-text components default to `'default'` — so the label can decode it unconditionally and never sees a texture path.

Critically, the control block still ends at 1024, so **every component-specific offset is unchanged**.

### 3. `Image.texture` is the payload tail

An `<Image>` cell is terminal — no children, one component field — so its `texture` now rides the same variable-length tail as a `Text` cell's content: emitted raw from `[1024]`, unpadded, unprefixed, uncapped. It was a fixed 83-byte string cell, which capped texture paths at 80 UTF-8 bytes and threw a `SerializationError` past it; deeply nested `textures/ui/…` paths hit that regularly. The render pack decodes it as the whole post-`[1024]` remainder.

Nothing before `[1024]` moved, the common `fontType` slot included — the control block below is unchanged.

### The v0008 control block

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
[606-688]:  fontType                 (string, 83) — the cell's font alias   ← new in v0008
[689-1023]: Reserved                 (335 bytes)                            ← was 418
[1024-]:    Component-specific fields
```

For an `Image` cell the component-specific region is just the texture tail. For a `Text` cell it carries the label group: `labelFontType`, `fontScaleFactor`, `labelX` `[1190]`, `labelY` `[1273]`, and the text tail. `labelFontType` stays in the group even though the cell label now sources `[606]`, so every later group offset — and every sub-element group that still reads its own slot 1 — is unchanged.

:::tip Custom native components are unaffected
Fields you define in a [custom native component](./api/custom-native-components.md) still start at `[1024]`. Both `region` (v0006) and `fontType` (v0008) were carved from the reserved block precisely so this offset never moves. If your resource pack decodes a custom component at a fixed offset from 1024, it keeps working — you only need the new render pack for the built-in components.
:::

## Protocol history

| Version | Change |
| --- | --- |
| `v0008` | Label group reordered to `[fontType, fontScale, x, y, text]`; terminal text is an uncapped variable tail; `Image.texture` is that tail too (uncapped); `RawMessage` tails serialize as rawtext for the client; common `fontType` field at `[606-688]` (reserved 418 → 335) |
| `v0007` | Scroll-component model — the title carries a flat list of scroll viewports (axis + geometry + content extent) instead of a screen type with per-region extents; a component's `region` field now holds the scroll index it belongs to |
| `v0006` | Common `region` field carved from the reserved block; title metadata generalized to one extent per region |

## Upgrading your code

Beyond the pack bump, three things changed at the API level.

### `Text.localizationKey` is removed

Replace it with a `children` value. If the string is a key your bundle publishes, the resolver detects it:

```tsx
// before
<Text localizationKey={'drav0011_shop.shop.title'} />

// after — typed, namespace applied at runtime
<Text>{key($ => $.shop.title)}</Text>

// after — if you genuinely only have the raw key string
<Text>{'drav0011_shop.shop.title'}</Text>
```

### The translation-keys plumbing is gone

`TranslationKeysContext`, `resolveTranslationKeysForPlayer`, `TranslationKeysByLocale` and `TranslationKeysMap` were removed along with the `translation-keys` Regolith filter. Resolution is now `@bedrock-core/i18n`-native and lazy — there are no materialized key maps anywhere.

```tsx
// before — a provider at the root, with a materialized map
<TranslationKeysContext value={resolveTranslationKeysForPlayer(keys, player)}>
  <App />
</TranslationKeysContext>

// after — nothing at the root at all
export const i18n = createI18n(bundle);   // registers the default translation source
render(App, player);                      // render() injects the resolver per player
```

Only override it deliberately, via [`TranslationContext`](./api/TranslationContext.md).

### The 80-byte text cap no longer applies to rendered text

Advice to "keep it under 80 bytes or use a localization key" is obsolete for `Text` children and for `Image.texture` — both are tails, both uncapped. Every **other** string field in a payload (`Background` and state textures, fonts, form labels routed through native channels) is still a fixed 83-byte field with an 80-byte content budget, and exceeding it still throws a `SerializationError` at serialize time.

## Checklist

1. Update `@bedrock-core/ui` (or `@bedrock-core/ui-runtime`) to this release.
2. Download the `core-ui-v*.mcpack` from the **same** release.
3. Replace the old pack in your `.mcaddon`, and **re-import** it into every test world and `com.mojang` install — the version number is unchanged, so nothing will prompt you to update.
4. Remove every `localizationKey` prop and the `TranslationKeysContext` provider.
5. Migrate your `.lang` authoring to the [i18n filter](../i18n/regolith-filter.md), or keep the keys and pass them as `Text` children.
6. Rebuild and open a screen. A blank screen with a clean log means the world is still loading an older pack.
