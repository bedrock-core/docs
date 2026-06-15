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
  form: ActionFormData,                             // target form
  ctx: SerializationContext | undefined,            // button-index / callback map
  callbacks: Record<string, (...args: unknown[]) => void>, // function props (onPress, …)
  props?: SerializableProps,                        // serialized values, if needed
) => void;
```

#### `emitButton` / `emitLabel`
Slot helpers for writers — see [step 2](#2-write-the-writer).

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
