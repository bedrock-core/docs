---
sidebar_position: 14
description: "Compose a string in every language the pack ships, at the width the layout gives a box."
---
# useComposed

Compose a string in every language the pack ships, at the width the layout gives a box.

## Import

```tsx
import { useComposed } from '@bedrock-core/ui';
```

## Signature

```ts
function useComposed(compose: (resolve: TranslationResolver, width: number | undefined) => string): Composed;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `compose`<Req /> | `(resolve: TranslationResolver, width: number \| undefined) => string` | — | What the text says in one language: `resolve` reads that language's strings, `width` is the room it has |

## Returns

A `Composed`, whose two halves are spread on two elements:

- `text` — on the `<Text>` that draws the composition, which the build draws through a key it writes into every language
- `box` — on the box whose width the composition has to fit, so the build lays it out at that width

## Usage

```tsx
function ShopTitle(): JSX.Element {
  const composed = useComposed((resolve, width) => {
    const long = resolve('drav0011_shop.title.long') ?? '';
    const short = resolve('drav0011_shop.title.short') ?? '';

    return width === undefined || measureText({ text: long }).width <= width ? long : short;
  });

  return (
    <Panel width={'100%'} {...composed.box}>
      <Text {...composed.text} />
    </Panel>
  );
}
```

Each language gets whichever title fits in it, and the player reads their own.

## Examples

### A breadcrumb trail

[`Trail`](/docs/ore-styled/Trail)'s `segments` is built on this hook: every segment is resolved in each language and the trail collapses from the middle to the room its row was laid out with.

## Notes

- A compiled screen has one layout, but what fits in it depends on what the text says, which differs per language. The build calls `compose` once for every language `RP/texts/languages.json` lists, with the strings that language's `.lang` holds. A key a language lacks resolves through the default language.
- `width` is `undefined` the first time. The screen is laid out, then laid out again with the width `box` was given, so compose something reasonable without one.
- Each distinct composition is drawn through one key, named after what it says in every language, which the build writes into each `.lang`.
- Outside a build, `compose` runs once, through the render's own resolver, with no width.
