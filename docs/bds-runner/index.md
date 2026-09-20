---
slug: /
sidebar_position: 1
sidebar_label: Overview
description: "Run an addon's GameTests headlessly on a Bedrock Dedicated Server and get a CI exit code."
---
# bds-runner

Runs a Minecraft Bedrock addon's GameTests on a real Bedrock Dedicated Server, headless, and exits with a CI status code.

:::caution Beta
`@bedrock-core/bds-runner` is in beta: the API can change between releases. Pin exact versions and read the changelog before upgrading.
:::

## What is @bedrock-core/bds-runner?

<Exec cmd="@bedrock-core/bds-runner run --packs ./build --tag my-suite" />

```text
  packs: My Addon (behavior, my-addon_bp), My Addon Resources (resource, my-addon_rp)
  running my-suite

  ✗ my-suite:shop_opens
      expected block minecraft:chest at 2,1,2
      [Scripting][info] shop: no chest registered for plot 0

✗ 5 passed, 1 failed   (my-suite, BDS 1.26.45.1, 7.1s)
```

The runner downloads the server, boots it, installs your packs into a world, runs one gametest tag, and reads each test's verdict from the server console. It needs no Minecraft client and no manual server download.

It needs Node 20 or newer, Windows or Linux (Mojang publishes the dedicated server for those two platforms only), and a behavior pack whose manifest depends on `@minecraft/server-gametest` and whose scripts register tests under the tag you pass.

## Install

For one-off use, run it through your package manager without installing:

<Exec cmd="@bedrock-core/bds-runner run --packs ./build --tag my-suite" />

To add it to a project:

<Install pkg="@bedrock-core/bds-runner" dev />

```json title="package.json"
{ "scripts": { "test:mc": "bc-bds run --packs ./build --tag my-suite" } }
```

Add `.bds/` to `.gitignore`: that is where the cache, server trees and logs live.

## What you get

- **A real server** — the build named in `bds-runner.json` or the newest stable, downloaded from minecraft.net and checked against its published SHA-1, so a test never passes against a server the game will not ship.
- **One command per suite** — `run --packs --tag` installs the packs, runs the tag and turns the console into verdicts; `--packs` more than once installs several addons into the same world, so a test asserting another addon is present can pass.
- **Exit codes CI can trust** — `0` passed, `1` tests failed, `2` the run could not be trusted, so a broken harness never looks like broken code.
- **Uncaught script errors fail the run** — an exception thrown outside any test is caught by the engine and logged; the runner counts it, so a green build over broken code cannot happen by accident.
- **A server you can join** — `--keep-alive` leaves the plots as the tests left them and the console in your terminal.

## Next steps

- [`Commands`](./cli.md) — `run`, `fetch`, `where`, every option, exit codes, uncaught script errors
- [`Configuration`](./config.md) — `bds-runner.json`, server properties, choosing the build, environment variables
- [`Running in CI`](/docs/filters/ci) — build with Regolith and test in the same GitHub Actions job
