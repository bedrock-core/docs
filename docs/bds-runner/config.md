---
sidebar_position: 3
description: "bds-runner.json, the server properties and world the runner sets up, how a build is chosen, the .bds working directory, and the environment variables."
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

The schema file the `$schema` line points at is generated from the selected server's own `server.properties`, so every key the build documents is typed and described in the editor, and the five keys the runner owns are marked deprecated. It is rewritten every time a build is resolved (`run`, `fetch`, and `where` once the build is cached), so it always describes the build the next run will use.

## Server properties

`server.properties` is rewritten before every run. Keys the runner does not list keep the value the build ships with.

| Key | Value | Why |
| --- | --- | --- |
| `gamemode`, `force-gamemode` | `creative`, `true` | Nothing wanders into a plot; a joining player can edit it |
| `difficulty` | `peaceful` | No mob AI competes for ticks |
| `default-player-permission-level` | `operator` | A joining player can run commands |
| `allow-list` | `false` | Anyone on the LAN can join a held-open server |
| `view-distance`, `tick-distance`, `max-threads`, `max-players` | `5`, `4`, `4`, `1` | The tests run in one plot; the rest is wasted simulation |
| `player-idle-timeout` | `0` | A kick mid-run would look like a hang |
| `content-log-file-enabled` | `true` | A second copy of the log on disk, next to the server |
| `script-watchdog-hang-threshold` | `60000` | A long test is not killed by the 10 s default |
| `script-watchdog-enable-shutdown` | `false` | A hung script fails the run instead of taking the server down before it can report |
| `enable-lan-visibility` | `false`, `true` with `--keep-alive` | Advertised on the LAN only when someone is meant to join |

Anything in `properties` is applied over those, so `"difficulty": "normal"` wins. `enable-lan-visibility` is forced back on by `--keep-alive` whatever the config says.

Five keys cannot be overridden because the runner depends on them: `level-name`, `server-port` and `server-portv6` (use `--port`), `allow-cheats`, and `online-mode`. Setting one is an error that names what controls it.

The runner also writes `config/default/permissions.json` so the world's scripts may import `@minecraft/server`, `@minecraft/server-gametest`, `@minecraft/server-ui` and `@minecraft/debug-utilities`, whatever the build's default list says.

## World

The world is generated once per server tree, on the first run, and reused after that. `level.dat` carries the two settings the tests need and that `server.properties` cannot express: the Beta APIs experiment, without which `/gametest` does not exist, and a flat generator, which gives every plot a predictable ground plane. Both are written into the generated `level.dat` and read back to verify they stuck.

Before every run the world's chunks are deleted and `level.dat` is kept, so each run starts on fresh terrain with the experiments still on. `--fresh` deletes the whole server tree instead, which forces a new copy of the build and a new world.

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

## Working directory

Everything the runner keeps lives under one directory, `<project>/.bds` by default. The project is the directory holding the nearest `bds-runner.json`, else the nearest `package.json` or `.git`, else the working directory.

| Path | Contents |
| --- | --- |
| `cache/<version>/<platform>/` | The extracted download, one per build. Never run from |
| `server/<version>/` | The tree the server runs in: a copy of the cache plus the generated `server.properties` and world. Kept between runs |
| `logs/` | One console transcript per run, and a `.bootstrap` log for the world-generating boot |
| `schema/bds-runner.json` | The JSON Schema for the config file |

Symlinks need elevation on Windows, so the server tree is a copy. With `BC_BDS_PATH` the tree is named after the directory the variable points at.

## Environment variables

| Variable | Effect |
| --- | --- |
| `BC_BDS_PATH` | Use a server you already have. Point it at the directory containing `bedrock_server` or `bedrock_server.exe`. Skips download and build selection |
| `BC_BDS_HOME` | Where the cache, server trees and logs are kept. Default `<project>/.bds`, which belongs in `.gitignore` |
| `BC_BDS_VERSION` | Build to use. Accepts `latest` |
| `BC_BDS_CHANNEL` | `stable` or `preview` |

`BC_BDS_PATH` is the route for networks that cannot reach minecraft.net.
