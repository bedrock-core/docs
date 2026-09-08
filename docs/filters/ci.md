---
sidebar_position: 9
description: "Run Regolith in GitHub Actions with the setup-regolith action."
---
# Running in CI

`bedrock-core/setup-regolith` is a GitHub Action that downloads the Regolith CLI, adds it to `PATH`, and registers resolvers, so a workflow step can run a profile the way you do locally.

## Usage

```yaml title=".github/workflows/build.yml"
name: Build
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Regolith
        uses: bedrock-core/setup-regolith@v1
        with:
          regolith-version: '1.6.1'
          resolvers: |
            github.com/bedrock-core/regolith-filters

      - name: Run Regolith profile
        run: regolith run release
```

After the step completes, `regolith` is on `PATH` for every later step in the same job. The action runs no profile itself.

## Inputs

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `regolith-version` | `string` | `latest` | Regolith release to install, `latest` or an exact version such as `1.6.1` |
| `resolvers` | `string` | — | Newline- or comma-separated resolver URLs, each appended with `regolith config resolvers --append` |

The binary for the runner's OS comes from the Regolith GitHub releases and is kept in the Actions tool cache, so repeat runs on the same version download nothing.

## Testing the build

Pair it with [`bds-runner`](/docs/bds-runner) to run the addon's GameTests on a dedicated server in the same job:

```yaml
      - name: Run GameTests
        run: npx @bedrock-core/bds-runner run --packs ./build --tag my-suite
```
