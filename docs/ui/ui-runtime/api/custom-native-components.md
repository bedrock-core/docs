---
sidebar_position: 3
---
# Custom Native Components

Register your own native component `type` that the runtime serializes and your
**own resource pack's JSON UI decodes and renders** — extending the framework
beyond the built-in `Panel` / `Text` / `Button` / `Image` primitives.

:::warning Advanced — you own both sides
This is a low-level extension point, not everyday API. To use it you need to
understand **two** things:

1. **Bedrock JSON UI** — control trees, bindings, and `modifications` to splice
   your control into an existing screen.
2. **This runtime's serialization protocol** — how a component's props become the
   compact binary payload your JSON UI control has to decode field-by-field.

Most UIs never need this: compose the built-in components instead. Reach for a
custom native component only when you need a JSON UI capability the built-ins
don't expose (a custom renderer, a special control, a binding the runtime doesn't
emit). Read the runtime source before you start:
**https://github.com/bedrock-core/ui/tree/main/packages/ui-runtime**
:::

## The big picture

A native component spans two packages you control:

```
TypeScript (this runtime)                    Resource pack (your JSON UI)
─────────────────────────                    ────────────────────────────
1. component → { type, props }
2. Writer    → form.button()/label()
3. registerComponent(type, …)
        │
        ▼  serialized payload (fixed-width binary, one form button/label entry)
                                             4. a JSON UI control decodes the
                                                payload, gated on  #type == 'type',
                                                spliced into button_router / label_router
                                                via  modifications
```

The runtime renders **everything** through just two ActionForm primitives:
`form.button()` (routed by `button_router`, interactive) and `form.label()`
(routed by `label_router`, static). A custom component picks one of those slots
in its writer, and the matching router on the RP side decodes it.

## TypeScript side

### 1. Define the component

A native component is a function component that returns a host element whose
`type` is your unique, **namespaced** string. Props must be serializable
primitives (`string` / `number` / `boolean`); use `withControl` to carry the
standard layout / visibility / `enabled` / `background` props.

```tsx
import { withControl, type JSX } from '@bedrock-core/ui';

interface RatingProps {
  stars: number;
  background?: string;
}

function Rating({ stars, ...rest }: RatingProps): JSX.Element {
  return {
    type: 'mypack:rating',
    props: {
      ...withControl(rest),
      stars, // serialized and decoded by your RP control
    },
  };
}
```

### 2. Write the writer

A `Writer` emits the serialized payload into one slot. Use the provided slot
helpers — they keep your component consistent with the presenter's selection
mapping:

- `emitButton(payload, form, ctx, callbacks, icon?)` — interactive (button) slot.
  Registers `callbacks.onPress` against the current button index and advances it.
- `emitLabel(payload, form)` — static (label) slot.

```tsx
import { emitLabel, type Writer } from '@bedrock-core/ui';

const ratingWriter: Writer = (payload, form, ctx, callbacks, props) => {
  emitLabel(payload, form); // static → label_router
};
```

For an interactive control, call `emitButton` instead and pass `ctx` / `callbacks`
straight through so `onPress` is wired up. The optional 5th `props` argument lets
the writer read serialized values (e.g. to pass an icon path to `form.button`).

### 3. Register it

Register the `type` → behavior mapping once, **before** `render()` runs your
component. The built-ins register themselves lazily inside `render()`; put your
own registration at module load (an import side-effect-free top-level call, or a
setup function you call before your first render).

```tsx
import { registerComponent } from '@bedrock-core/ui';

registerComponent('mypack:rating', { writer: ratingWriter });
```

`registerComponent` **throws on a duplicate type**, so clashes between addons
surface immediately instead of silently overriding — always namespace your type
(`mypack:rating`, not `rating`). A wrapper component that emits nothing itself and
just renders its children registers as `{ transparent: true }` instead of a
writer (this is how `fragment` works).

## Resource pack side

The serialized payload arrives as a single form `button` or `label` entry. On the
RP side you:

1. **Build a JSON UI control** that decodes the payload. The runtime prefixes a
   protocol header, then writes each prop as a fixed-width field (type-prefixed
   `s:` / `n:` / `b:`, padded, with a per-field marker). Your control slices those
   fields out with `%.Ns` view bindings — exactly like the built-in components do.
2. **Gate it on `#type`** so it only renders for your component:
   `(#pre_visible and (#type = 'mypack:rating'))`.
3. **Splice it into the router** — every form entry passes through `button_router`
   (interactive, `emitButton`) or `label_router` (static, `emitLabel`); each control
   inside renders for every entry but stays hidden unless its `#type` gate matches.
   Add your control to that router's `controls` array with a JSON UI `modifications`
   block — the same `insert_back` pattern the runtime uses to inject controls into
   the vanilla `server_form`:

```json
// your_pack/ui/button_router_ext.json
{
  // Modify the runtime's router (same namespace + element name = merge).
  // Your pack must sit ABOVE @bedrock-core's RP in the pack stack.
  "namespace": "core_ui_common",
  "button_router": {
    "modifications": [
      {
        "array_name": "controls",
        "operation": "insert_back",
        "value": [
          { "rating@mypack.rating": {} }
        ]
      }
    ]
  }
}
```

For a static (`emitLabel`) component, modify `label_router` the same way. The
inserted control (`mypack.rating`) is the decode panel from steps 1–2 — its
`#type` gate is what keeps it hidden for every form entry that isn't yours.

The built-in controls are the reference implementation for the decode bindings
and the router wiring — read them alongside the serializer:

- Decode + `#type` gate pattern: `packages/resource-pack/packs/RP/ui/core-ui/components/*.json`
- Router shape: `core-ui/common/button_router.json`, `core-ui/common/label_router.json`
- Field layout & protocol `VERSION`: [`packages/ui-runtime/src/core/serializer.ts`](https://github.com/bedrock-core/ui/tree/main/packages/ui-runtime)

:::caution Keep the protocol in sync
The payload format is versioned (`PROTOCOL_HEADER` / `VERSION` in `serializer.ts`).
If the runtime's protocol version changes, your decode bindings must be updated to
match — a mismatched header means your control reads garbage.
:::

## Modal form controls

Everything above covers the `ActionFormData` backend (`button_router`/`label_router`).
[`Form`](../components/Form.md) renders through a **second** backend — native
`ModalFormData` — which has its own typed controls and its own set of writer
helpers. A decorative custom component (`emitLabel`) works unchanged on both
backends, since `form.label()` exists on `ActionFormData` and `ModalFormData` alike.
An *interactive* custom component for use inside a `Form`, though, must emit through
one of the four modal-only emitters instead of `emitButton` — `ModalFormData` has no
generic button slot, only four typed ones:

```ts
import { emitToggle, emitSlider, emitDropdown, emitInput, type Writer } from '@bedrock-core/ui';
```

#### `emitToggle(payload, form, ctx, name, defaultValue)`
Emits a `ModalFormData.toggle`. `defaultValue: boolean`.

#### `emitSlider(payload, form, ctx, name, min, max, defaultValue, valueStep)`
Emits a `ModalFormData.slider`. `valueStep: number | undefined` — pass `undefined`
for the native default step (`1`).

#### `emitDropdown(payload, form, ctx, name, options, defaultValueIndex)`
Emits a `ModalFormData.dropdown`. `options: string[]`, `defaultValueIndex: number`.
The native control returns the selected **index**, not a value — see
[`Form.Dropdown`](../components/FormDropdown.md)'s result gotcha.

#### `emitInput(payload, form, ctx, name, placeholder, defaultValue)`
Emits a `ModalFormData.textField`. `placeholder: string`, `defaultValue: string`.

Each takes the same leading `payload, form, ctx` triple as `emitButton`, then the
native control's own typed arguments directly — not as serialized payload fields.
Each also records `name` against the control's ordinal (so the presenter can re-key
`response.formValues[ordinal]` back into `{ name: value }` after submit) before
making the typed `ModalFormData` call. A modal control writer must still throw a
`ModalFormError` if `!isModalForm(form)` — see any built-in `Form.*` writer
(e.g. `FormToggle.ts`) for the guard pattern.

### The `nativeArgs` channel

A modal control's non-primitive or purely-computed data (a dropdown's `options`
array, a slider's `min`/`max`/`defaultValue`) doesn't need to survive as a decoded
JSON UI binding — the RP never reads it, only the writer does. Passing it through
the normal serialized `payload` would cost payload bytes and could shift the
byte offsets every other field is decoded at. Components route this data instead
through the writer's 6th argument, `nativeArgs?: Record<string, unknown>` — a
side channel that's never serialized:

```ts
export const FormToggle: FunctionComponent<FormToggleProps> = ({ name, defaultValue, ...layout }) => ({
  type: MODAL_TOGGLE_SLOT_TYPE,
  props: { ...withControl(layout) /* control-block payload, decoded by the RP */ },
  nativeArgs: { name, defaultValue: defaultValue ?? false }, // writer-only, never serialized
});
```

The writer reads `nativeArgs` directly (`formToggleWriter` in the example above
reads `nativeArgs.name`/`nativeArgs.defaultValue`) instead of decoding them from
`props`. Most components never need this — it exists specifically for the built-in
modal field controls, where a rich prop surface (state backgrounds, geometry,
per-option styling) would otherwise blow the ≤64-props/≤80-bytes-per-field budget
described in [Caveats](#caveats). A custom modal control only needs `nativeArgs` if
it has similarly non-primitive or purely-internal data to pass its writer.

### Dropdown popup architecture

If your custom modal control needs a floating popup (like `Form.Dropdown`'s option
list), be aware the popup is **not** rendered inside the control's own subtree —
Bedrock's native dropdown popup box ignores its host's anchors once naively
hosted, so the built-in dropdown instead renders its popup through a purpose-built
overlay:

- **`modal_container`**'s `inside_header_panel` is a real control at the modal's
  content root, *outside* the scroll, holding a `collection_panel` (`popup_overlay`)
  that generates one `dropdown_popup_router` per form row.
- **`dropdown_popup_router`** shows itself only when its own row is an open
  dropdown (gated on the row's decoded `#type` plus the native open/close toggle
  state) and, when visible, centers a `dropdown_popup_card` on the host's exact
  center point — so the popup is always form-width and layered above every row,
  regardless of which cell opened it.
- The dropdown's own closed-box control (`dropdown_content`) keeps only an
  **invisible** `input_panel` shield: it owns the native open/close state and the
  `dropdown_exit` button mappings, but draws nothing (no `"modal": true`, or the
  shield would swallow all input to the popup rendered outside it).
- `inline_select.json` deliberately points its own `dropdown_area` at a
  **nonexistent** control name (`inline_offscreen_area`) — since `inside_header_panel`
  is now a real host, pointing an inline (non-popup) select there would incorrectly
  re-host its rows into the popup overlay.
- The main modal scroll keeps `always_handle_scrolling: false` so mouse wheel input
  routes by pointer position; the popup's own scroll claims the wheel globally
  (`$always_handle_scrolling: true`) only while it exists (gated by the router).

Read `packages/resource-pack/packs/RP/ui/core-ui/common/modal_container.json` and
`.../form_components/dropdown.json` together with `optionPayload.ts` before
building a custom control that needs similar popup/overlay behavior — the comments
in those files record several traps (e.g. an `input_panel` backdrop behind the
popup silently eats all option-row clicks) that are easy to reintroduce.

## API reference

```ts
import {
  registerComponent,
  getRegisteredTypes,
  emitButton,
  emitLabel,
  type ComponentDescriptor,
  type Writer,
} from '@bedrock-core/ui';
```

#### `registerComponent(type, descriptor)`
- `type: string` — unique, namespaced component type; must match the JSON UI
  control's `#type` gate.
- `descriptor: ComponentDescriptor` — `{ writer }` for a renderable control, or
  `{ transparent: true }` for a children-only wrapper.
- Throws `SerializationError` if `type` is already registered, or if the
  descriptor is neither transparent nor has a writer.

#### `getRegisteredTypes(): string[]`
All currently registered type strings, sorted. Handy for debugging "unknown
component type" errors.

#### `ComponentDescriptor`
```ts
interface ComponentDescriptor {
  writer?: Writer;        // emits the payload via emitButton / emitLabel
  transparent?: boolean;  // emits nothing; the serializer walks to children
}
```

#### `Writer`
```ts
type Writer = (
  payload: string,                                  // serialized props
  form: FormTarget,                                 // ActionFormData or ModalFormData
  ctx: SerializationContext | undefined,             // button/ordinal index + callback map
  callbacks: Record<string, (...args: unknown[]) => void>, // function props (onPress, …)
  props?: SerializableProps,                        // serialized values, if needed
  nativeArgs?: Record<string, unknown>,              // writer-only side channel, see below
  children?: unknown,                                // built children, for writers that read post-layout geometry
) => void;
```

`form` is `FormTarget = ActionFormData | ModalFormData` — narrow it with
`isActionForm`/`isModalForm` before calling a backend-specific method. `nativeArgs`
and `children` are almost always `undefined` for an ActionForm-only component; they
exist for [modal form controls](#modal-form-controls) that need a side channel for
non-primitive data or post-layout child geometry (e.g. `Form.Radio` reading each
`Form.Option`'s computed position).

#### `emitButton` / `emitLabel`
Slot helpers for ActionForm writers — see [step 2](#2-write-the-writer). For modal
form writers, see [`emitToggle`/`emitSlider`/`emitDropdown`/`emitInput`](#modal-form-controls).

## Caveats

- **Namespace your type.** Registration throws on duplicates; `mypack:rating`
  avoids cross-addon clashes.
- **Register before serialization.** If a component serializes before its type is
  registered, `render()` throws "Unknown native component type".
- **Props must be serializable primitives** (`string` / `number` / `boolean`).
  Functions are collected as callbacks (e.g. `onPress`); everything else throws.
- **Field budget.** Each string/number field is fixed-width (≤ 80 bytes per value),
  and an element can carry at most 64 props — keep payloads lean.
- **You maintain the RP side.** A runtime protocol bump requires updating your
  decode bindings to match.
