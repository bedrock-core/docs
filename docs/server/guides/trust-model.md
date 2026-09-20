---
sidebar_position: 3
description: "What the framework can defend against, what it cannot, and what security means between packs that share a world."
---

# Trust model

Installing a pack is trusting it. The framework defends against a buggy pack and against a player reaching what is not theirs; it does not — and cannot — defend against a hostile pack.

## The facts the design rests on

1. **Every behavior pack runs arbitrary script** with the full `@minecraft/server` surface. It can kill players, write any dynamic property, send any script event.
2. **Script events carry no sender identity.** `scriptEventReceive` gives a message id and a string; the sender in a [sync envelope](/docs/sync/protocol) is whatever the sender wrote. No primitive in the platform lets a realm prove which pack it is.
3. **Code cannot cross realms.** A pack can send another pack *data*; it cannot make it *run anything* that pack's own code does not already do with data.

From the third fact: the framework cannot be patched, hooked or code-injected by another pack. Its functions live in the realm that imported it; no message reaches them except through handlers the runtime itself registered.

From the first two: everything the framework holds as *data* can be spoofed. Any pack can announce a schema under another addon's namespace, answer an RPC as any node, write any mirror key, or overwrite a dynamic property directly — the last one without touching bedrock-core at all.

## What follows

There is nothing to build a defense against a hostile pack on, so none is built:

- Signing or an HMAC needs a secret; the secret lives in the pack; every pack can read it.
- An allowlist of trusted namespaces is data in the same realm-readable place.
- The installed-pack list is not readable from script, so nothing can be cross-checked.

This is the same trust model as Java mods, Node packages and browser extensions. A world's operator chooses what to install; from then on the packs are peers.

## What security means here

Three things are real.

### Player authorization

The boundary that exists is between a **player** driving a UI or a command and the data they may not touch. [`authorize`](../api/authorize.md) keys off an actor — the player a request is made on behalf of — and reads the readonly `playerPermissionLevel`, never a value another script could rewrite. Every player-facing write path carries an `actorId` and goes through it; a request with no actor is an addon acting for itself, which is a documented capability and stays open.

### Robustness against a buggy pack

A bug in one addon must not take down the world's other addons. This is where the effort goes:

- **Every inbound payload is guarded on read.** An [announcement](../api/announcement.md) that fails its guard reads as nothing published; a malformed RPC or event payload is dropped, logged against the claimed sender.
- **Failure is isolated at every cross-realm boundary.** A listener that throws — on an observable, a shared key, an event — is caught and reported, and the others still run. Nothing escapes into an engine subscriber.
- **A reply is always awaited with a timeout**, so an absent peer can never hang a caller.
- **Stored bytes are coerced on read**, never trusted for shape: a config document is coerced to its schema, a db document that cannot be read is quarantined rather than deleted.
- **Only the owner writes its namespace.** The [mirror](../api/shared.md#who-may-write) drops a foreign write and counts it, so one addon's mistake cannot overwrite another's state.

### Accidental collision

Two addons choosing the same namespace is far likelier than an attacker, and the [registry](../api/registry.md#onnamespacecollision) reports it.

## Limits

- No cryptographic identity of packs. Not possible; not attempted.
- No sandboxing of another addon's code. No such primitive exists.
- No hiding data from other packs. Dynamic properties are world-global; the `core-` prefix is a namespace convention, not a permission.

## Next steps

- [`authorize`](../api/authorize.md) — the one rule a handler applies on behalf of a player
- [Sharing data between addons](./channels.md) — what crosses a realm, and only because the owner said so
- [sync protocol](/docs/sync/protocol) — what an envelope carries
