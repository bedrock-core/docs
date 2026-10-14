---
sidebar_position: 12
description: "Compile trusted TS/JS resources independently of the builder and runtime translation library."
---
# compileI18n

Compile trusted TS/JS resources independently of the builder and runtime translation library.

## Import

```ts
import { compileI18n } from '@bedrock-core/builder-i18n';
```

## Signature

```ts
function compileI18n(options: I18nOptions): Promise<I18nResult>;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `options` | `I18nOptions` | — | Project inputs, settings and optional integrations for this operation |

## Returns

Generated runtime bundle, language outputs, declarations, dependencies and warnings.

## Usage

```ts
import { compileI18n } from '@bedrock-core/builder-i18n';

const result = await compileI18n({
  root: process.cwd(),
  namespace: 'example_addon',
});
```

## Notes

Without locale inputs the bundle is absent. Runtime use requires the corresponding i18n runtime package.
