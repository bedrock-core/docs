---
sidebar_position: 5
description: "Every check that stops a compiled screen's build, and what fails it."
---
# Build checks

A failed check stops the build with the compiler's own message, which the [`ui-compiler` filter](/docs/filters/ui-compiler) relays unchanged, because those messages already name the fix.

| Check | What fails |
| --- | --- |
| Root | A tree that starts with something other than `<Screen>`, `<Form>` or `<Container>`; more than one element at a form's root; a `<Container>` naming neither `entity` nor `block`, or naming both |
| Shape | A screen that adds, drops or reorders a cell when its state changes |
| Live text | A `<Text>` whose string changes with no `maxLength`; the message names each string it saw and the length it needs |
| Carried visibility | A `visible` that moves on a container screen, which bakes it |
| Looks | A prop that changes with state on an element the host draws itself — a press, a slot, a live string, a live image or a list — naming each prop and the values it saw; or an element taking more than 63 looks on a container screen |
| Static | `<Screen static>` on a screen that carries a live value or runs a handler of its own, naming which |
| Trans | A tag left open or closed out of order, a placeholder in a `<Trans>` string, a `<Text>` component setting more than `color` and `shadow`, a press inside a press, or a component that is neither |
| Canvas | Content laid out past 320 × 210, with the size it measured |
| Mechanism | A component the screen's host has no mechanism for — a slider or a dropdown outside a modal, a slot outside a container screen |
| Unsupported | A control with no compiled form at all, listing what is supported |
| Face rules | A face carrying a binding that reads a host, an image without `keep_ratio: false`, a label that does not say whether it localizes, two siblings of one name, a reference or `source_control_name` that resolves to nothing |
| Placement | A host that moved a control while standing its mechanism in, with the face's rect and the host's |
| Shared faces | A control that changes at runtime, or one needing a definition of its own, baked inside a button's face |
| Names | Two screens with the same name; a name or namespace outside letters, digits, `_` and `-` |
| Face collision | Two screens of one addon sharing a face name with different contents |
| Host | A screen naming an entity or block that has no definition under `BP/entities` or `BP/blocks`; two screens naming the same host |
| Block capacity | A block-hosted screen needing more than 54 container slots |
| Crafting table | A block-hosted screen naming a block that declares `minecraft:crafting_table` |
| Namespace | No `namespace` setting and no `manifest: { creator, pack }` in the register call |
| Import time | A module that reaches for the game while being evaluated |

An entry that throws on the way to its `core.register()` call is a warning, not a failure: the addon gets none of the screens that follow from declaring, and the reason is printed rather than leaving a pack that builds clean with none of its app screens in it.
