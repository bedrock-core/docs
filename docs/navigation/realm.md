---
sidebar_position: 5
description: "uiOf(core) is the UI a realm has once, whichever apps are installed: the show methods, the navigator, the way back, and where each player is."
---

# The realm

A screen is drawn by the addon whose pack holds it. Most of the shared UI is in every pack, so whichever realm a command is typed into draws it; what one addon *declared* exists in exactly one bundle, and reaching it means asking that addon's realm. `uiOf(core)` is the part of that every app needs exactly once, however many apps an addon installs.

## Import

```ts
import { uiOf, methodFor, isUiTarget, isUiReturn, registerDeclared } from '@bedrock-core/navigation';
import type { UiPresence, UiTarget, ScreenTarget, UiReturn, TargetOpener } from '@bedrock-core/navigation';
```

## uiOf

```ts
uiOf(core: Runtime): UiPresence
```

The realm's one UI presence, built on the first call and kept in the runtime's `core:ui` slot. Every app calls it and gets the same object, so the show methods, the navigator and the way back are installed once. An app registers what it draws and reads the rest back:

```ts
const realm = uiOf(core);

realm.serve('config', (player, target) => openConfig(core, player, target));
realm.offers('config');
```

## Targets

A place in the UI, as data. What travels when one realm asks another to draw a screen, and what comes back the other way when the player leaves it:

```ts
interface UiTarget {
  readonly kind: string;
  readonly addonId?: string;
  readonly [field: string]: unknown;
}
```

The `kind` is open. This package serves one of them itself, `screen`, because a key and its params are the whole of what a cross-realm `navigate()` carries; every other kind belongs to the app that serves it, and an app narrows the fields of its own kind with its own guard. `addonId` is the one field the realm reads for itself: a kind nothing here serves is sent to that addon's realm, which may have installed the app this one did not.

`isUiTarget` checks the envelope off the wire: a string `kind`, and for `screen` a string `key` and, when present, an object `params`. `isUiReturn` does the same for one hop of a way back, `{ realm, target }`. A realm running an older or newer copy of an app may have sent either, so a path with anything unreadable in it is dropped rather than half-walked.

## One method per kind

```ts
methodFor(kind: string): string   // 'core:config.show', or 'core:ui.show' for a screen
```

The method a realm is asked on is derived from the kind, not registered, so a caller maps one to the other with nothing to probe. An addon that did not install an app does not serve its method, and the request is refused with `unknown method`: a visible failure the caller falls back from, instead of a target kind silently opening the wrong screen.

## Serving a kind

| Member | Description |
| --- | --- |
| `serve(kind, opener)` | Register what draws that kind here, and start answering its method. One opener per kind; a second throws |
| `serves(kind)` | Whether an app mounted in this realm draws that kind |
| `show(player, target)` | Draw a target: the local opener, or the owning realm when nothing here serves the kind, or the owner of a screen key this bundle did not compile |

`show` is the funnel. A command, a press on a page, a request from another realm and an app's own `open` all end here, which is where a target is routed once.

## Asking another realm

| Member | Description |
| --- | --- |
| `ask(owner, player, target, from?)` | Ask `owner`'s realm to show a target, carrying the way back. Never rejects; resolves whether that realm took the player |
| `returnTo(player)` | The way back a request from here carries: the realms the player crossed, with this one appended when it has a place to name |
| `showing(player, target)` | Record what this realm is showing a player, as the target that put them there |

When the other realm takes the player, this one drops its component tree and input lock but leaves the forms on screen: closing them would close the one that realm just opened.

`showing` matters for one kind of screen. A screen drawn from a *model*, a catalog or a roster, cannot be returned to by its key, because rendering its component with no model draws the empty shape of it. The target that opened it is what can be sent back across a realm, so every such screen records it.

## Resolving keys

| Member | Description |
| --- | --- |
| `reference(key)` | The reference for one screen key: the sources this realm added first, then whatever an addon published. `undefined` is a key nothing in this world can draw |
| `resolve(source)` | Add a source of references tried before the published ones, for screens baked into a pack that no addon announces |
| `alias(addonId, ns)` | Say which UI namespace a row belongs to when that row is not an addon that publishes |
| `screenKey(addonId, name)` | The key of one of an addon's screens by the name its build gave it, read off what that addon published or off an alias |

The framework is the one row that needs the last three: it has a page and a guide but no realm, so it announces nothing. The catalog hands the realm its table and its namespace.

## The first tick

```ts
realm.onReady(() => { /* publish something read off the build */ });
```

Runs on the first tick, when every module the entry imports has been evaluated and the build's declarations are in hand; immediately if that tick has passed. Every publisher runs in a try/catch that warns rather than throws, so an addon shipping an older runtime than the UI it mounts loses one announcement rather than failing to start.

The realm publishes two things itself: this addon's [screen references](./references.md), and its page in the catalog when the build declared one.

## What an addon offers

| Member | Description |
| --- | --- |
| `offers(app)` | Declare that this addon serves an app, by the name its target kind is known by |
| `offered(addonId)` | What an addon announced it serves. Empty for one that announced nothing |

Announced as one list on the first tick, after every app has installed, so any realm can tell what a peer answers before asking it. A catalog uses it to draw an entry for an app an addon does not serve as unreachable, rather than leading a player at a request that would be refused. An app that only learns during its own tick whether it has anything to serve, a guide with no pages, still counts: the list goes out last.

## What the build declared

```ts
registerDeclared({ page });
declaredParts(): DeclaredParts
```

The channel the build uses to hand the runtime something the addon author never wrote. The ui-compiler filter generates a module that asks each installed app for the screens its declaration implies; the catalog's builds the addon's page from the manifest and calls `registerDeclared` with it, and the realm reads it back on the first tick and publishes the reference. The generated module is imported for its side effect at the top of the entry, which is what makes it evaluate before anything reads it.

## Notes

`uiOf` serves `core:ui.show` for `screen` targets, installs [`provideReferences`](./references.md) with `ask` and `sendBack` wired to the transport, and forgets a player's place when they leave. An app never installs a navigator, serves that method or keeps its own return path.

A realm running an older copy of an app understands as much of a target as it knows and falls back for the rest. Nothing about a target's fields reaches the runtime.
