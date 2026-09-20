# @bedrock-core/docs

Documentation for @bedrock-core, built with [Docusaurus](https://docusaurus.io/).

Available at <https://bedrock-core.drav.dev>

## Install

```bash
yarn
```

## Develop

```bash
yarn start
```

Starts a local dev server and opens a browser window. Most changes are reflected live without a restart.

## Build

```bash
yarn build
```

Generates static content into the `build` directory, servable by any static hosting service.

## Writing a page

Every page under `docs/` follows [`STYLE.md`](./STYLE.md).

## Sections

`src/data/sections.ts` is the registry of sections: id, category, status, description, icon and source repository. `docusaurus.config.ts` creates one docs-plugin instance per section that has a matching `docs/<id>` folder, and the navbar, sidebar switcher and home page all read the same registry.
