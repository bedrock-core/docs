---
sidebar_position: 2
description: "The *.screen.tsx file and what compiling it asks of the source: names and keys, reserved values, carried visibility, static screens, and screens from a module or an app."
---
# Writing a screen

A screen is a module ending in `.screen.tsx`, anywhere under `BP/scripts`, that default-exports a component. The [`ui-compiler` filter](/docs/filters/ui-compiler) compiles every one it finds. Ordinary `.tsx` helpers sit beside one untouched — only the suffix marks a screen.

```tsx title="packs/BP/scripts/screens/counter.screen.tsx"
/** @jsxImportSource @bedrock-core/ui */
import { Button, Panel, Screen, Text, useState, type JSX } from '@bedrock-core/ui';

export default function Counter(): JSX.Element {
  const [count, setCount] = useState(0);

  return (
    <Screen>
      <Panel padding={8} gap={6}>
        <Text maxLength={16}>{`count ${count}`}</Text>
        <Button enabled={count < 9} onPress={() => setCount(value => value + 1)}>{'+'}</Button>
      </Panel>
    </Screen>
  );
}
```

The build runs the component once to decide the **shape**; the runtime runs it again per viewer to decide the **values**, and the two walks line up position for position because a compiled screen's shape is fixed. Nothing about a screen is declared twice.

A container screen is the same file with `<Container>` at its root and a host — an entity or a block — to open from:

```tsx title="packs/BP/scripts/screens/crafting_table.screen.tsx"
/** @jsxImportSource @bedrock-core/ui */
import { Container, Panel, Slot, Text, useState, type JSX } from '@bedrock-core/ui';

export default function CraftingTable(): JSX.Element {
  const [planks, setPlanks] = useState(0);

  return (
    <Container entity={'drav0011_shop:crafting_table'} padding={8} gap={6}>
      <Text maxLength={12}>{`planks ${planks}`}</Text>
      <Panel background={'textures/ui/slot_enabled'}>
        <Slot
          role={'both'}
          onInsert={({ stack }) => setPlanks(value => value + stack.amount)}
          onRemove={({ stack }) => setPlanks(value => value - stack.amount)}
        />
      </Panel>
    </Container>
  );
}
```

A block-hosted screen is the same shape with `block` in place of `entity` — see [Host definitions](./output.md#host-definitions) for what each stamps onto its definition.

## Names and keys

A screen's **name** is its file name without the suffix: `counter.screen.tsx` is `counter`. With the addon's namespace it becomes the JSON UI namespace `<namespace>_counter`, the output file, and the key `<namespace>:counter` that `<Link to>` and `navigate()` take. The name has to be unique across the addon whatever directory the screen sits in.

## Live values are reserved, not discovered

A compiled screen is baked, so a string that changes has to say how much room to reserve for it:

```tsx
<Text maxLength={16}>{`count ${count}`}</Text>
```

The build renders the component with each state slot perturbed and fails on anything that moved without a reservation, naming the strings it saw and the `maxLength` each needs. The same probe fails a screen whose **shape** moved — a cell added, dropped or reordered — because the cells are numbered once, at build time.

## Conditionals become carried visibility

`{cond && <X/>}` has already collapsed to `false` by the time any renderer sees it, and nothing can tell which element went missing. So the build rewrites the source text of every `.screen.tsx` before executing it, and ships the same rewrite to the runtime:

| Written | Compiled as |
| --- | --- |
| `{cond && <X/>}` | `<X visible={cond} liveVisible={true}/>` |
| `{cond ? <A/> : <B/>}` | `<A visible={cond} liveVisible/><B visible={!(cond)} liveVisible/>` |
| `{cond ? <A/> : null}` | `<A visible={cond} liveVisible/>` |

An element that already carries `visible` keeps it, joined with `&&`. Only branches that are single elements are rewritten; a string, fragment or call in a branch is left alone — wrap it in an element to make it compilable. A form carries visibility on an entry; a container screen bakes it, so a container screen whose `visible` moves is a build error. [Conditional rendering](../components/control-props.md#conditional-rendering) shows the same rewrite from the component side.

## Static screens

A screen is **static** when every string it shows is baked and every press is a `<Link>` or the way out. Nothing about it can differ between one present and the next, so the build already knows everything showing it takes — the title, the value each entry carries, the key and params each press leads to — and the addon ships that table instead of the component that would recompute it.

`<Screen static>` is the assertion, not the mechanism: a qualifying screen is detected either way, and declaring it makes the build fail the moment the screen stops qualifying.

```tsx title="packs/BP/scripts/screens/menu.screen.tsx"
/** @jsxImportSource @bedrock-core/ui */
import { Link, Panel, Screen, Text, type JSX } from '@bedrock-core/ui';

export default function Menu(): JSX.Element {
  return (
    <Screen static>
      <Panel flexDirection={'column'} padding={6} gap={4}>
        <Text>{'Menu'}</Text>
        <Link to={'shop'}><Text>{'Shop'}</Text></Link>
        <Link to={'drav0011_economy:balance'}><Text>{'Balance'}</Text></Link>
      </Panel>
    </Screen>
  );
}
```

A key with no `<addon>:` in front of it is one of this bundle's own, named as its file is; a key that names another addon resolves through the reference that addon published.

A modal never qualifies — its fields are built per present — and neither does anything with a live value, a handler of its own, or a link whose params are not plain data. [Navigation](../guides/navigation.md#static-screens) covers publishing the table so other realms can show the screen.

## Import time

:::caution A screen module, and everything it imports, must not touch the world at import time
The filter evaluates the module once, on the build machine, with `@minecraft/server` and `@minecraft/server-ui` replaced by stubs that answer every name the packages declare and do nothing. Hooks are fine: the compiler renders the component with its initial state. What breaks is module-scope code that reaches for the game — `world.afterEvents.*.subscribe(...)`, `system.run(...)`, a dynamic property read next to an `import`. Keep that in the module that opens the screen; a screen's handlers and effects only ever run in game.
:::

## Library screens

A screen can also come from a module whose default export is a record of components, named by its keys. The filter's `screens` setting lists such modules:

```jsonc title="config.json"
{ "filter": "ui-compiler", "settings": { "screens": ["./BP/scripts/screens/shared.ts"] } }
```

## App screens

The bedrock-core apps need no entry in `screens`: declaring is what asks for their screens. The filter reads the register call in `BP/scripts/main.ts` or `BP/scripts/index.ts` and, for each app it finds there, bakes the module the app's declaration names and asks that module for the screens that follow from the declaration. The filter knows no app by name; an app describes itself.

| On the declaration | What it is |
| --- | --- |
| `app` | The app's name, `'catalog'`, `'config'`, `'guide'` |
| `compiled` | The module to bake. Its default export is the app's own screens, like any `screens` module. Absent for an app whose screens another filter writes, as the guides filter does per page |

A `compiled` module may also export `shape(declared, manifest)`: given the declaration as data, its installer dropped, and the manifest fields, it returns the screens the declaration implies, named. The [catalog](/docs/catalog/page)'s returns the page the manifest becomes; [config](/docs/config)'s returns one screen per section of the declared schema. The generated module calls it at build time to bake those screens and again at runtime, so an app registers there whatever it needs to find them later.

## Next steps

- [What the build writes](./output.md) — where a screen is mounted, how the client picks it, and what is stamped onto its host
- [Build checks](./checks.md) — everything that stops a build, and what fails it
- [Hosts](../guides/hosts.md) — which root to write, and what each screen can carry
- [Container screens](../guides/container-screens.md) — serving a screen an entity or a block owns
