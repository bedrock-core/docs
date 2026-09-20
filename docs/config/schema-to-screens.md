---
sidebar_position: 2
description: "The shape of the schema decides the shape of the UI: which levels become forms, which become screens of buttons, and what each entry type is drawn as."
---

# From a schema to screens

The shape of the schema decides the shape of the UI, and one platform fact drives all of it: **a native modal form has exactly two controls, its submit and its dismiss.** There is no third control to navigate with, so a form can never offer "open this sub-section" or "edit this list".

The ui-compiler filter reads the definition out of `core.register()` and bakes one screen per section into the addon's pack, shaped for the settings that section has. Nothing about a section travels at runtime; only the values do.

## One rule per level

| The level holds | It renders as |
| --- | --- |
| only form fields | a **form** |
| one or more sub-groups and/or lists | a **screen of buttons**, one row per sub-group or list |

A level cannot mix form fields with sub-groups or lists. `registerConfig()` and the ui-compiler reject that shape with the path that needs restructuring. Put the form fields in a named child group instead. This keeps every screen unambiguous: it is either a form or a menu.

Walking a schema shaped like the reference addon:

```ts
server: {
  economy: {                    // only groups     -> screen of buttons
    balances: { /* fields */ }, //                 -> form
    currency: { /* fields */ }, //                 -> form
  },
  display: {                    // only destinations -> screen of buttons
    general: {                  //                   -> form
      prefix: { /* ... */ },
    },
    advanced: { /* fields */ }, //                   -> own form, reached from display
  },
  moderation: {                 // only lists      -> screen of buttons, one row per list
    blockedItems: { type: 'list', /* ... */ },
  },
}
```

Depth is unbounded, and each level answers only for itself: a tree can be pure structure for three levels and then hold settings.

:::note A list is not a form field
Lists have no native modal control, so every level that holds one opens a screen of buttons and each list gets a real editor there. Put any form fields in a child group beside the list.
:::

## What each entry becomes

| `type` | Extra fields | Rendered as |
| --- | --- | --- |
| `boolean` | — | toggle |
| `number` | `min`, `max` (**required**), `step?` | slider, or a text input when the range exceeds 100 |
| `string` | `maxLength?` | text input |
| `select` | `options`, a string array or a string `enum` | toggle-button segments taking one, up to **3 options**; a dropdown beyond that |
| `multiselect` | `options`, a string array or a string `enum` | the same segments taking any number, up to **3 options**; one checkbox per option beyond that |
| `list` | `maxItems?` | **no control**. It gets [an editor of its own](#editing-a-list-in-game) where there is room for a button, and shows its items plus [the command](./commands.md#list-settings-from-a-command) where there is not |

Every entry takes `label` and an optional `description`. The entry types themselves, what each requires and what value it infers, are the [settings subsystem](/docs/config/settings#entry-types)'s.

:::tip Why segments stop at three
Segments show every choice at once and take one press to change; a dropdown hides them behind a press and a scroll. Past three the segments are too narrow to read, which is the point the dropdown, or a column of checkboxes, starts winning. Nothing to configure: the count decides.
:::

Groups are nested objects, and may name themselves with [`$label` and `$description`](/docs/config/settings#naming-a-group). Without them the UI derives a title from the key.

## Editing a list in game

Reached from a button screen, a list opens its own editor: current items as rows, a press to remove one, and an **Add** button. Adding presents a native modal with a text field. `maxItems` disables Add and says why.

Each list change writes immediately. The list editor does not have a Save button because every add, edit, or removal is already a complete list value.

## Next steps

- [Commands](./commands.md) — the two commands, and the list verbs a form cannot draw
- [Permissions and scopes](./permissions-and-scopes.md) — who reaches which scope
- [Entry types](/docs/config/settings#entry-types) — what each entry requires and the value it infers
