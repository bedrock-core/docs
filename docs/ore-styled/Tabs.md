---
description: "Panes switched on the client, each header a label on the theme's faces."
---
# Tabs

Panes switched on the client, each header a label on the theme's faces.

![Tabs](/img/ore-styled/Tabs.png)

## Import

```tsx
import { Tabs } from '@bedrock-core/ore-styled';
```

## Usage

```tsx
<Tabs width={280} height={140}>
  <Tabs.Tab label={'Items'}>
    <ItemList />
  </Tabs.Tab>
  <Tabs.Tab label={'Log'}>
    <Log />
  </Tabs.Tab>
</Tabs>
```

It is [`Tabs`](/docs/ui/components/Tabs) with the [theme](./theme.md)'s `tabs` faces applied and a label in place of a drawn header. A chosen tab wears the pressed face and its label drops a pixel; labels are white whichever tab is chosen.

Switching tabs reaches no script and presents nothing again. A tab whose content depends on the switch is a screen change, not a tab.

## Props

### Tabs

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tabHeight` | `number` | the theme's tab height | Height of the header row; the panes take what is left |
| `tabBackground` | `string` | the theme's normal face | The face a header is drawn on while its tab is not chosen |
| `tabHover` | `string` | the theme's hover face | The face while the pointer is over a tab that is not chosen |
| `tabSelected` | `string` | the theme's pressed face | The face while its tab is the chosen one |
| `gap` | `Spacing` | `-1` | Space between headers; `-1` is the overlap that fuses adjacent borders |

Inherits [control props](/docs/ui/components/control-props).

### Tabs.Tab

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label`<Req /> | [`DisplayText`](/docs/i18n/api#displaytext) | — | The tab's name on its header |
| `children` | `JSX.Node` | — | The pane shown while the tab is chosen |

## Examples

### A face of your own for the chosen tab

```tsx
<Tabs tabSelected={'textures/ui/my_tab_selected'} width={280} height={140}>
  <Tabs.Tab label={'One'}>{first}</Tabs.Tab>
  <Tabs.Tab label={'Two'}>{second}</Tabs.Tab>
</Tabs>
```

## Notes

The headers share the row's width evenly, so keep each label short enough to fit its share.

The theme's `tabs` section and its textures started as copies of the toggle buttons'.
