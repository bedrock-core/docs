# @bedrock-core/docs

Documentation for @bedrock-core, built using [Docusaurus](https://docusaurus.io/).

Available in <https://bedrock-core.drav.dev>

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Search

DocSearch is configured from the environment. Copy `.env.example` to `.env` and
fill in the three values from the Algolia dashboard; without them the site builds
with no search box. The deploy workflow reads the same names from repository
variables and secrets.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
