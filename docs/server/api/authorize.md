---
sidebar_position: 11
description: "authorize is the one rule an RPC handler applies before it does anything on behalf of a player."
---

# authorize

`authorize` is the one rule an RPC handler applies before it does anything on behalf of a player: an operator reaches anything, anyone else reads world state and reaches only their own entity, and a request with no acting player is an addon acting for itself.

Nothing here defends against a hostile *pack*, which runs arbitrary script and can write the underlying dynamic properties directly. What it enforces is that a **player** driving a UI or a command cannot reach what is none of their business — see the [trust model](../guides/trust-model.md).

## Import

```ts
import { authorize, denyReason, isOperator } from '@bedrock-core/server';
import type { AccessTarget, Operation } from '@bedrock-core/server';
```

## Signature

```ts
authorize(target: AccessTarget, actorId: string | undefined, operation: Operation): void
```

## Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `target` <Req /> | `AccessTarget` | — | What the request reaches: `{ world: true }`, `{ dimension: id }`, `{ entity: id }` or `{ block: id }` |
| `actorId` <Req /> | `string \| undefined` | — | The player the request is made on behalf of; `undefined` for an addon acting programmatically |
| `operation` <Req /> | `'read' \| 'write'` | — | What the request does |

## Returns

Nothing. Throws `Error('refused: <reason>')` when the request must be refused, so a handler's promise rejects with the reason and the caller learns why.

## Usage

```ts
core.rpc.serve<EconomyApi>({
  balance: ({ playerId, actorId }) => {
    authorize({ entity: playerId }, actorId, 'read');

    return balances.for(playerOf(playerId)).get();
  },

  deductGold: ({ playerId, gold, actorId }) => {
    authorize({ entity: playerId }, actorId, 'write');

    const doc = balances.for(playerOf(playerId));

    doc.patch({ gold: (doc.get()?.gold ?? 0) - gold });

    return doc.get();
  },
});
```

The caller passes `actorId` when a player is behind the request — a screen, a command — and omits it when the addon acts for itself.

## The rule

| Situation | Outcome |
|---|---|
| No `actorId` | **Allowed.** An addon acting programmatically, not a player. |
| Actor is not in the world | **Refused** — `acting player '<id>' is not in the world` |
| Actor is a world operator | **Allowed** anywhere |
| Anyone else, reading a world, dimension or block target | **Allowed** — world state is not a secret from the player in it |
| Anyone else, writing a world, dimension or block target | **Refused** — `a <kind> target may only be changed by an operator` |
| Anyone else, their own entity | **Allowed**, to read and to write |
| Anyone else, another entity | **Refused** — `a non-operator may only reach their own document` |

## `denyReason`

```ts
denyReason(target: AccessTarget, actorId: string | undefined, operation: Operation): string | undefined
```

The same rule as a value: the reason a request must be refused, or `undefined` when it is allowed. `authorize` is `denyReason`, thrown.

## `isOperator`

```ts
isOperator(player: Player): boolean
```

Whether the player is a world operator. Reads `player.playerPermissionLevel`, which is **readonly** on `Player`, and deliberately not `commandPermissionLevel`, which is mutable and could be rewritten by any script in the world — authorization must never rest on a value another addon can hand itself. `PlayerPermissionLevel.Custom` is a separate bucket, not a tier above `Operator`, so it is not accepted. A player whose handle has been invalidated is not an operator.

## Notes

- The rule keys off the **actor**, never the calling pack. Script events carry no sender identity a rule could rest on.
