---
sidebar_position: 11
description: "Compile trusted Markdown/MDX content without the builder or guide runtime installed."
---
# compileGuides

Compile trusted Markdown/MDX content without the builder or guide runtime installed.

## Import

```ts
import { compileGuides } from '@bedrock-core/builder-guides';
```

## Signature

```ts
function compileGuides(options: GuidesOptions): Promise<GuidesResult>;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `GuidesOptions` | — | Project inputs, settings and optional integrations for this operation |

## Returns

Guide manifest, generated files, declarations, diagnostics and page counts.

## Usage

```ts
import { compileGuides } from '@bedrock-core/builder-guides';

const result = await compileGuides({
  root: process.cwd(),
  namespace: 'example_addon',
  compileScreens: false,
});
```

## Notes

Screen generation needs a behavior pack. compileScreens: false emits guide content without generated screen modules.

Generated modules use `guideNavigationScreen` for resident client navigation. Home, index, page and caller-return entries compile separately for each audience, and every entry preloads that audience's readable pages.
