---
sidebar_position: 4
description: "Non-operators reach their own player scope only, wherever a target enters the config screens."
---

# Permissions and scopes

Non-operators reach their **own player scope only**. The addon that owns the settings is the only realm that draws them, and it applies the rule to every target that reaches its screens.

## Scopes

| Scope | Applies to | Target |
| --- | --- | --- |
| `server` | the whole world | none |
| `dimension` | one dimension | dimension id |
| `player` | one player | player id |

What a scope is, how it is stored and how it is read is the [settings subsystem](/docs/config/settings#the-three-scopes)'s; this page is about who may open one.

## The rule

This package decides what a player is **shown** and where a command drops them:

- An **operator** is decided by the **readonly** `playerPermissionLevel`, never the script-writable `commandPermissionLevel`. `PlayerPermissionLevel.Custom` does **not** count as operator. It is the runtime's own rule, [`isOperator`](/docs/server/api/authorize#isoperator).
- An operator reaches all three scopes, anyone else `player` only. The scope picker offers only those, so the scope screens never enter a normal player's navigation stack.
- A target is silently *pinned* rather than refused: a non-operator's gets `scope: 'player'` and their own player id, which deep-links them straight onto their own settings. A plain `:config` drops a normal player onto their own settings and the screens they cannot use never open.

The clamp is applied wherever a target enters this realm, `config.open()`, its own commands and a request from another realm alike, because a request off the wire has had no caller in this realm apply it.

## Next steps

- [Commands](./commands.md) — how the two permission levels map onto two commands
- [`authorize`](/docs/server/api/authorize) — the same rule, for RPC methods you serve yourself
- [Trust model](/docs/server/guides/trust-model) — what the framework defends against, and what it cannot
