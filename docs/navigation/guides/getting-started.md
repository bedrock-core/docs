---
sidebar_position: 1
description: "Build two local pages in one compiled host and open it with the normal UI renderer."
---
# Build a navigator

Create page components, define a static route tree, and mount it inside one compiled host.

## Write page content

Local pages are ordinary components. Their content sits inside the navigator's host, so they return controls instead of a second `Screen` or `Form`.

```tsx title="packs/BP/scripts/UI/pages.tsx"
import { Panel, Text, type JSX } from '@bedrock-core/ui';
import { CommonActions, Link } from '@bedrock-core/navigation';

export function Home(): JSX.Element {
  return <Panel><Link screen={'Details'}>
    <Text>{'Open details'}</Text>
  </Link></Panel>;
}

export function Details(): JSX.Element {
  return <Panel><Text>{'Details page'}</Text>
    <Link action={CommonActions.goBack()}><Text>{'Back'}</Text></Link>
  </Panel>;
}
```

## Define the host

A `*.screen.tsx` file is an independently compiled host entry. Its static navigator defines which content pages can share that form.

```tsx title="packs/BP/scripts/UI/app.screen.tsx"
import { Panel, Screen, type JSX } from '@bedrock-core/ui';
import { createStackNavigator, createStaticNavigation } from '@bedrock-core/navigation';
import { Home, Details } from './pages';

const RootStack = createStackNavigator({
  id: 'app',
  initialRouteName: 'Home',
  screens: { Home, Details },
});
type AppNavigator = typeof RootStack;
declare module '@bedrock-core/navigation' {
  interface RootNavigator extends AppNavigator {}
}
const Navigation = createStaticNavigation(RootStack);

export default function AppScreen(): JSX.Element {
  return <Screen><Panel width={300} height={200}><Navigation /></Panel></Screen>;
}
```

The root type registration gives `Link` and hooks their route names and parameter types. It does not create a second runtime root. See [TypeScript](./typescript.md) for nested and parameterized routes.

## Build and open it

Run the project's [builder](/docs/builder/guides/stages#ui-compilation) and enable the generated resource pack alongside the matching shared UI pack. Builder registers the compiled screens automatically.

```ts title="packs/BP/scripts/main.ts"
import type { Player } from '@minecraft/server';
import { render } from '@bedrock-core/ui';
import AppScreen from './UI/app.screen';

export function openApp(player: Player): void {
  render(AppScreen, player);
}
```

The declarative Details link can switch pages without reopening the form. A server action or exhausted local plan creates a checkpoint and starts another bounded window.

## Reuse a page independently

Wrap shared content in a separate `*.screen.tsx` host to make it independently openable. A page using route hooks or route links still needs a mounted navigator in that host. Plain content can render directly inside `Screen`.

Native modal forms and block/entity containers use separate hosts. Declare their published keys in the route tree to reach them through the same navigation API.

## Next steps

- [Client and server navigation](./client-navigation.md) — eligibility, budgets and checkpoints
- [Stacks and top tabs](./nesting.md) — combine navigators and select a scope
- [Core integration](../realm.md) — discover destinations in other addons
