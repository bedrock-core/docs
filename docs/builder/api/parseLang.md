---
sidebar_position: 27
description: "Parse a Minecraft .lang file into a key→value map. Lines starting with # are comments; blank lines are skipped. Format: key=value (value may contain '=')."
---
# parseLang

Parse a Minecraft .lang file into a key→value map. Lines starting with # are comments; blank lines are skipped. Format: key=value (value may contain '=').

## Import

```ts
import { parseLang } from '@bedrock-core/builder-i18n';
```

## Signature

```ts
function parseLang(content: string): Record<string, string>;
```

## Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `string` | — | Language-file source text |

## Returns

Language keys mapped to parsed string values.

## Usage

```ts
import { parseLang } from '@bedrock-core/builder-i18n';

const values = parseLang('example.title=Example\n');
```
