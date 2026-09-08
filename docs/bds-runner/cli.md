---
sidebar_position: 2
description: "The bc-bds commands, every run option, exit codes and how uncaught script errors are reported."
---
# Commands

```text
bc-bds run --packs <dir> --tag <tag> [options]   run a suite
bc-bds fetch                                     download and cache the server
bc-bds where                                     show which build will be used, and from where
```

## `run` options

| Option | Effect |
| --- | --- |
| `--packs <dir>` | A build directory. Repeatable. Required |
| `--tag <tag>` | The gametest tag to run. Required |
| `--expect-registered <n>` | Fail unless the engine announces exactly `n` tests. Catches a suite that silently failed to register |
| `--known-failure <id>` | A test that is expected to fail. Repeatable. It is reported but does not make the run red |
| `--allow-script-errors` | Report uncaught script errors without failing the run. See [Uncaught script errors](#uncaught-script-errors) |
| `--origin "<x> <y> <z>"` | Where test plots are placed. Default `8 -60 8` |
| `--idle <seconds>` | End the run once the server has been quiet this long with every test accounted for. Default `45` |
| `--timeout <seconds>` | Wall-clock limit for the whole run. Default `900` |
| `--port <n>` | Server port. Default `19140` |
| `--fresh` | Recreate the server tree and world from scratch |
| `--keep-alive` | After the results, keep the server running so you can join it. See [Looking at the plots](#looking-at-the-plots) |
| `--offline` | Never download. Fail if the server is not already cached |
| `--quiet` | Do not echo server output while the run is in progress |
| `--json <path>` | Also write the result as JSON: tag, server version, duration, per-test verdicts, regressions, and any infrastructure error |

### Build selection options

Accepted by every command. See [Choosing the server build](./config.md#choosing-the-server-build).

| Option | Effect |
| --- | --- |
| `--bds-version <v>` | An exact build such as `1.26.45.1`, or `latest` |
| `--bds-channel <c>` | `stable` or `preview` |
| `--config <path>` | Read this `bds-runner.json` instead of searching for one |

### What `--packs` accepts

Either a directory containing `BP/` and optionally `RP/`, which is what Regolith exports, or a directory that is itself a single pack. A pack is treated as a behavior pack when its manifest declares a `script` or `data` module, and as a resource pack otherwise.

Passing `--packs` more than once installs several addons into the same world. That is how a test which asserts that *another* addon is present can pass. Each pack is copied into the world under a folder named after the addon it came from, so two addons that both export `BP/` do not collide.

## Looking at the plots

A failure message says what the assertion was, not what the world looked like. `--keep-alive` keeps the server up after the results are printed so you can connect a client and see for yourself:

```bash
bc-bds run --packs ./build --tag my-suite --keep-alive
```

```text
✗ 5 passed, 1 failed   (my-suite, BDS 1.26.45.1, 7.1s)
  log: .bds/logs/2026-09-07T20-26-53-336Z-core.log

  server kept running for inspection: connect to 127.0.0.1:19140
  type a server command here; `stop` or Ctrl+C ends the session
```

The test structures are left exactly as the tests left them. The server is advertised on the local network, so it shows up under Friends in the client; otherwise add it as a server at `127.0.0.1` on the run's port. You join in creative mode as an operator.

While it is up, anything typed into the terminal is sent to the server console, so you can teleport, run `gametest runset` again, or anything else. `stop` or Ctrl+C shuts the server down cleanly, and the world is wiped once it has exited. The exit code is the one the tests earned, regardless of what happened afterwards.

On Windows, the Minecraft app cannot connect to a server on the same machine until the app is exempted from loopback isolation. This is a one-time step in an elevated prompt:

```text
CheckNetIsolation LoopbackExempt -a -n=Microsoft.MinecraftUWP_8wekyb3d8bbwe
```

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | Every test passed, or the only failures were declared with `--known-failure` |
| `1` | Tests failed |
| `2` | The run could not be trusted: no server, no boot, no tests announced, or the tag is unknown |

`1` and `2` are distinct so that a broken harness can never look like broken code.

Any test the engine announces but never reports a verdict for is counted as a failure. The run is over when every announced test has a verdict, or when the idle or wall-clock timeout fires.

## Uncaught script errors

An exception thrown outside a test — from an event subscriber or a deferred callback — shares no call stack with any test, so no test can fail on it. The engine catches it, logs it against your pack, and carries on. Left alone that is a green build over broken code.

The runner collects these and fails the run by default:

```text
✓ 11 passed, 0 failed   (core, BDS 1.26.43.1, 10.0s)

  1 uncaught script error(s), seen by no test:
      [my_addon] Error: something broke    at <anonymous> (main.js:15976)

  infrastructure: 1 uncaught script error(s) were logged.
```

Errors your own code logs with `console.error` are left alone; only an exception the engine reports counts, recognized by its error class or its stack frame. Pass `--allow-script-errors` to report them without failing.
