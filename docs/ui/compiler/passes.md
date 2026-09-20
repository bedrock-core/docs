---
sidebar_position: 4
description: "The face pass and the host pass, the three layers between the IR and the JSON UI, and the behaviors a primitive carries."
---
# Faces and hosts

Every screen is compiled twice over, and one invariant separates the halves: the **face pass** owns the layout, the **host pass** owns the mechanism. A host may replace what a control *is*; it may never move it.

| Pass | Takes | Gives | Bindings |
| --- | --- | --- | --- |
| Face | the solved IR | the addon's shared faces, and one face document per screen | never |
| Host | a face document and a placement | the screen document the host serves | only here |

## Faces and sockets

A **face** is a node's look with its static props. A **socket** is a node with at least one carried prop or one input: a button with a press, a label whose text is live, a slot, a native field, a subtree whose `visible` is carried.

The face document draws every socket as its inert face — the button with no mappings, the label with its reference string, the slot as an empty cell frame, the field as its payload-free twin — so the document is complete and drawable with no host behind it at all. That is what the static validator checks.

The host then takes each socket, in document order, and either **wraps** its face (a gate reading a carried `visible`; a one-child `stack_panel` carrying an entry index) or **replaces** it (a cell over a container slot, a text carrier in place of a static label, a native field placed by its row). Nothing outside the sockets is touched.

Two reasons the split is not cosmetic:

- The rules that only hold for static trees run once, over the face document, with no host in the loop. A face carrying a binding that reads a host is itself a failure.
- An engine component behind a gate that reads a collection row which is not there is a client assertion. A slider or a toggle lives in a face, and a face has no bindings, so nothing built hidden can evaluate a row.

A face document cannot leave a named hole for another file to fill: a `$variable` used as an `@` base mounts nothing. So the face pass hands the host a complete document and the host splices into it.

## The rect guard

After the host emits, every control's `size`, `offset`, `anchor_from` and `anchor_to` are diffed against the face document. Any difference is a build error naming the control and the host: the placement is the layout's, signed off before any host touched the screen. The guard runs inside every compile, so the tests and a project build both hit it.

## The three layers

The stretch between the IR and the JSON UI is three directories, each a pure step and each testable without the other two.

| Layer | Takes | Gives | Knows |
| --- | --- | --- | --- |
| `faces/` | plain data: a rect, textures, a style, children already drawn | one control entry — the look, written as JSON UI | nothing else; no host, no context, no address |
| `connectors/` | that face, plus the address the host allocated | the control that stands in the face's place | one host each |
| `nodes/` | a JSX element | an IR node, and the mechanism that node needs | the IR, and what each kind is |

A face is `(data) => ControlEntry`; a connector is its mirror, `(data, face, ctx) => ControlEntry`. Children reach a face already drawn, so no recursion crosses two layers, and a connector never sees an IR node — everything it needs is in its own payload.

`connectors/chest` and `connectors/form` are separate entry points rather than one barrel, because the two hosts share names and nothing else: a form's `press` is an entry the engine reports back, a chest's is an item taken and put straight back.

Faces come in three families. **Primitives** are one look with nothing composed. **Compositions** have no look of their own and add the native plumbing that mixes drawn parts, which on a compiled screen is always a toggle. **Utils** are the vocabulary the two share.

`nodes/` holds `primitives/` and `utils/` and nothing else. Every kind is one JSON UI control type with its static props; the utilities are what more than one lowering reads off an element. There is no composition layer — a composition is a component, built out of primitives.

## The seam

Nothing above a host dispatches on a host, and nothing below a host dispatches on a component. Both directions are registries, not switches.

| Registry | Holds | Adding to it |
| --- | --- | --- |
| Node definitions | one entry per IR kind: which JSX types it lowers from, its children, the mechanism it needs, its face | a module under `nodes/primitives/` plus a list entry |
| Hosts | one entry per screen the library draws on | a folder under `hosts/` plus a list entry |
| Host mechanisms | one function per socket kind the host can serve | a key in that host's `fill` table |

A node kind is one vertical slice: its IR shape, how a built element lowers into it, and how that shape draws. The walks stay dumb — the lowering walk owns order, geometry and naming; the face walk owns document assembly; the host walk owns socket order — and each dispatches through the definitions.

A socket kind absent from a host's table is refused at build, by name, in that host's own words. That is the whole of the capability model: `press`, `text`, `texture`, `slot`, `grid`, `field`, `list`, `visible` and `look` are the kinds, and a host serving none of them draws faces alone, which is exactly what a preview is.

## Behaviors

A behavior is client-only logic a primitive carries: still static, still in the face document, never a mechanism. Between them they are every switch the library has.

| Behavior | What it is |
| --- | --- |
| `route` | a button's mappings: close, submit, form click |
| `group` | swaps that move together, one forced index each |
| `states` | which children a control draws per state |
| `follows` | a sibling drawn while a swap beside it is on |

A swap is the one mechanism a compiled screen owns outright: a toggle changes its own content with nothing reaching script. So everything built on it — a tab change, a fold, a choice between options — costs no press, no re-present and no payload. [`<Tabs>`](../components/Tabs.md) is a group of swaps whose panes are drawn; [`<Disclosure>`](../components/Disclosure.md) is one swap with a panel that follows it.

Content a swap shows lives inside the look, which is what keeps a look that is not showing from being built. Two things follow. A look may **draw** a sibling of its swap, which the compile moves inside it and re-bases from the swap's own corner — for content too big to solve inside the control that switches to it, such as a tab's whole pane. And `follows` is the one read in the other direction, for the one case that cannot nest: a fold's rows have to reflow what is under them, and a stack gives a hidden child no space, which is the reflow.

Everything crossing siblings is resolved in the one walk that has the sibling list, because nothing inside a node can see what sits beside it.

## Adding a host

A host is one Minecraft screen the library draws on, and the transport that screen offers. Every screen-specific fact lives in one: the routing, the carriers, the inputs, the vanilla file that is hooked, the chrome, the runtime loop.

1. Measure the screen — which vanilla file, which collection or string it publishes, what a control can read there, what an input looks like from script, how it is opened and closed.
2. Fill in the capability row: root element, owner, update model, routing key, carriers, inputs, native controls, cost unit. A column with nothing in it means the host offers nothing there, and components needing it are refused. That is correct, not a gap to paper over.
3. Write the contract shared with the runtime — carriers, inputs, routing, `allocate` — then the build half and the runtime half. No component changes. No IR changes unless the screen has a primitive nothing else has, and then as a host-agnostic node kind the host serves.
4. Add the vocabulary it needs to the render pack under `core_ui_<host>`.
5. Add a screen to the reference addon.

`allocate` is the one walk that runs at build and at runtime both, and it must produce the same placement position for position. Everything else in the build half runs only at build.

## Next steps

- [`@bedrock-core/ui-compiler`](./api.md) — the entry points the filter calls
- [Hosts](../guides/hosts.md) — what each of the three screens can carry
- [Extending components](../guides/custom-native-components.md) — composing controls and adding framework-level native behavior
