---
sidebar_position: 10
---
# useTranslation

Bind an addon's typed translation verbs to the player viewing the UI.

## Import

```tsx
import { useTranslation } from '@bedrock-core/ui';
```

## Signature

```tsx
function useTranslation<R>(instance: I18n<R>): BoundI18n<R>
```

### Parameters

#### `instance`
- Type: `I18n<R>`
- Description: The addon's own `createI18n(bundle)` instance. Passing it is what keeps the verbs fully typed — selectors, interpolation arguments and plural leaves all come from that bundle's type.

### Returns

- Type: `BoundI18n<R>`
- Description: The verb set bound to the viewing player's resolved locale — `locale`, `t`, `key`, `raw`, `resolve`, `display`.

This is exactly `instance.forPlayer(usePlayer())`.

## Usage

```tsx
import { Panel, Text, useTranslation } from '@bedrock-core/ui';
import { i18n } from '../i18n';

function Shop() {
  const { t, key, raw } = useTranslation(i18n);

  return (
    <Panel padding={10} gap={4}>
      <Text>{key($ => $.shop.title)}</Text>
      <Text>{raw($ => $.shop.bought, { item: 'Apple', price: 64 })}</Text>
      <Text>{t($ => $.shop.total, { amount: 128 })}</Text>
    </Panel>
  );
}
```

Where `i18n` is the addon's single instance:

```ts
// BP/scripts/i18n.ts
import bundle from '@bedrock-core/generated/i18n';
import { createI18n } from '@bedrock-core/i18n';

export const i18n = createI18n(bundle);
```

See the [i18n guide](../../i18n/i18n.md) for what each verb does and when to prefer which.

## The locale it binds to

The bound locale is resolved through the full chain, first hit wins:

1. A persisted per-player override (`i18n.setLocale(player, 'es_ES')`)
2. The player's client language
3. A sibling region of that language (`es_MX` → `es_ES` before English)
4. The bundle's default locale, then any locale it carries

`locale` on the returned set is the one that won, which is handy to show back to the player:

```tsx
const { t, locale } = useTranslation(i18n);

<Text>{t($ => $.settings.currentLanguage, { locale })}</Text>
```

## Examples

### Plurals

A plural leaf needs a bound verb set, because which suffix wins depends on the target language's rules. `useTranslation` is that binding.

```tsx
function Stock({ count }: { count: number }) {
  const { t } = useTranslation(i18n);

  return <Text>{t($ => $.shop.stock, { count })}</Text>;
}
```

### Switching language from the UI

`setLocale` writes a dynamic property rather than component state, but you do not have to force a refresh: the new locale is already in effect when the screen comes back.

```tsx
function LanguagePicker() {
  const player = usePlayer();
  const { t } = useTranslation(i18n);

  return (
    <Panel flexDirection={'row'} gap={4}>
      <Button onPress={() => i18n.setLocale(player, 'es_ES')}>
        <Text>{t($ => $.settings.spanish)}</Text>
      </Button>
      <Button onPress={() => i18n.clearLocale(player)}>
        <Text>{t($ => $.settings.systemLanguage)}</Text>
      </Button>
    </Panel>
  );
}
```

### Turning a key back into a string

`display()` resolves any `DisplayText` — a literal, a key, or a `RawMessage` — to a plain string, for the places a key must **become** text: chat prefixes, string concatenation, values passed to APIs that take no `RawMessage`.

```tsx
function BuyButton({ item }: { item: Item }) {
  const player = usePlayer();
  const { display, key, raw } = useTranslation(i18n);

  return (
    <Button onPress={() => {
      const prefix = display(key($ => $.shop.chatPrefix));
      player.sendMessage(`${prefix} ${display(raw($ => $.shop.bought, { item: item.name, price: item.price }))}`);
    }}>
      <Text>{key($ => $.shop.buy)}</Text>
    </Button>
  );
}
```

For chat specifically, prefer sending the `RawMessage` itself — `player.sendMessage(raw(…))` lets the client resolve it. Reach for `display()` only when you need a `string`.

## Outside a component

There is no fiber and no player to read, so bind explicitly instead — it is the same call:

```ts
world.afterEvents.playerSpawn.subscribe(({ player }) => {
  const { raw } = i18n.forPlayer(player);
  player.sendMessage(raw($ => $.shop.welcome, { name: player.name }));
});
```

## Best Practices

### Create the instance once

```ts
// ✅ Good — one module-scope instance, imported everywhere
export const i18n = createI18n(bundle);

// ❌ Bad — a new instance per render re-registers the default source every pass
function Screen() {
  const i18n = createI18n(bundle);
  const { t } = useTranslation(i18n);
}
```

### Prefer `key()` / `raw()` over `t()` for painted text

`key()` and `raw()` let the **client** resolve the string in its own language, with no length cap. Reach for `t()` when your code needs the actual string — layout maths, chat composition, a value you concatenate.

### Don't hand-roll the hook

```tsx
// ❌ Redundant
const { t } = i18n.forPlayer(usePlayer());

// ✅ Same thing, one call
const { t } = useTranslation(i18n);
```

## Related

- [i18n](../../i18n/i18n.md) — the verbs, plurals, interpolation and locale chain
- [useTranslationResolver](./useTranslationResolver.md) — the active resolver, for components that build display strings themselves
- [TranslationContext](../api/TranslationContext.md) — overriding which resolver a subtree sees
