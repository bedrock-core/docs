---
sidebar_position: 3
description: "bds-runner.json, the server properties the runner sets, how a server build is chosen, and the environment variables."
---
# Configuration

Add a `bds-runner.json` at or above the directory you run the command from, usually the project root. Every key is optional.

```json title="bds-runner.json"
{
  "$schema": "./.bds/schema/bds-runner.json",
  "version": "1.26.45.1",
  "channel": "stable",
  "properties": {
    "view-distance": 8,
    "difficulty": "normal"
  }
}
```

| Key | Type | Default | Description |
| --- | --- | --- | --- |
| `version` | `string` | `"latest"` | An exact build, or `"latest"` |
| `channel` | `'stable' \| 'preview'` | `"stable"` | Which release channel `latest` resolves in |
| `properties` | `object` | `{}` | Overrides written into `server.properties` before every run. Any key the server documents |

The schema file the `$schema` line points at is written by the runner on its first run.

## Server properties

The runner sets creative mode, peaceful difficulty, cheats, operator permission, no Xbox Live sign-in, a small view and tick distance, no idle kick, and a raised script watchdog. Anything in `properties` is applied over those, so `"difficulty": "normal"` wins.

Five keys cannot be overridden because the runner depends on them: `level-name`, `server-port` and `server-portv6` (use `--port`), `allow-cheats`, and `online-mode`. Setting one is an error that names what controls it.

## Choosing the server build

By default the runner uses the newest stable build. For one run:

```bash
bc-bds run --packs ./build --tag my-suite --bds-version 1.26.45.1
bc-bds where --bds-channel preview
```

Precedence, highest first:

1. `--bds-version` / `--bds-channel`
2. `BC_BDS_VERSION` / `BC_BDS_CHANNEL`
3. The nearest `bds-runner.json`, or the file named by `--config`
4. Newest `stable`

`bc-bds where` prints the selected build, the config file it came from, the schema path, and the current upstream builds.

Build metadata comes from [Bedrock-OSS/BDS-Versions](https://github.com/Bedrock-OSS/BDS-Versions); the download itself comes from minecraft.net and is checked against the published SHA-1. If the index is unreachable the run fails rather than falling back to a build it already has.

## Environment variables

| Variable | Effect |
| --- | --- |
| `BC_BDS_PATH` | Use a server you already have. Point it at the directory containing `bedrock_server` or `bedrock_server.exe`. Skips download and build selection |
| `BC_BDS_HOME` | Where the cache, server trees and logs are kept. Default `<project>/.bds`, which belongs in `.gitignore` |
| `BC_BDS_VERSION` | Build to use. Accepts `latest` |
| `BC_BDS_CHANNEL` | `stable` or `preview` |

`BC_BDS_PATH` is the route for networks that cannot reach minecraft.net.
