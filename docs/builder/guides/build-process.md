---
sidebar_position: 2
description: "Follow a build through temporary files, ordered stages and plugins, validation and pack export."
---
# How builds run

A build runs an ordered pipeline over temporary files on disk.

## Run a profile

```sh
bc-builder build config.json development
```

Builder reads `config.json` and selects the named profile. The profile supplies stage settings, plugin steps and each pack's export destination. Omitting the profile name selects `default`.

## Temporary workspace

Every build creates a fresh `bedrock-core-build-<id>` directory in the operating system's temporary directory, normally `%TEMP%` on Windows. The project is copied into its `project` folder, preserving source paths:

```text
bedrock-core-build-<id>/
  project/
    config.json
    packs/
      BP/
      RP/
  generated/
```

Pack names and paths come from `config.json`; `packs/BP` and `packs/RP` are examples. Export destinations, `.git`, `node_modules` and `.bedrock-core` are excluded from the copy. Installed project dependencies remain available to build tools.

Stages and module plugins edit the copied files. `context.stagedRoot` points to `project`, `context.packs` contains the copied pack directories, and `context.generatedDir` points to `generated` for intermediate files. Ordinary build edits leave authored pack files intact.

## Pipeline order

1. **Prepare** copies the project into the workspace, then runs steps placed after `prepare`.
2. **Transform** runs the selected built-in stages in order: manifest, generator, guides, i18n, UI compiler and bundler. Plugin steps run at their configured before or after boundaries. Each operation finishes before the next starts, so later operations see earlier file edits.
3. **Validate** checks registered artifacts, manifests and pack JSON after the last modifying step, including steps placed before `export`.
4. **Export** publishes each staged pack to the destination configured for its ID. Intermediate files outside pack directories are not exported.
5. **Clean up** removes the temporary workspace when the build finishes or fails. A failed transformation or validation leaves previous exports intact.

Automatic stage detection reads the current staged files after that stage's before hooks. A plugin can therefore generate an input that a later stage discovers. [Stages](./stages.md) describes each transformation.

## Plugin file access

| Definition | Execution | Files to edit |
| --- | --- | --- |
| `module` | Builder calls the exported `run(context, settings)` function in its process | Staged paths from `context.packs` or `context.pack.path` |
| `script` | Builder starts a Node process with a temporary working directory | Relative `BP`, `RP` and `data` folders |

A script's working directory is inside the build workspace. Before an invocation, builder copies the selected staged packs into its `BP` and `RP` folders. After a successful invocation, those folders replace the corresponding staged packs, including file additions, modifications and deletions. Later stages, scripts and module plugins see the result.

Scripts use this folder-based view of the selected packs. Script plugins can use `targets` to run separately for every matching pack or `packs` to select a BP/RP pair in a project with several packs. The temporary `data` folder is shared by script invocations in the same build. [Node scripts](./node-scripts.md) describes mapping and arguments.

## Rebuilds

Each watch rebuild creates a fresh workspace. Verified compiler outputs can be restored from the project's `.bedrock-core/cache` into staging; participating plugin steps still execute. Generated editor declarations and cache records persist under `.bedrock-core`, independently of the temporary workspace.

## Next steps

- [Configuration](./configuration.md) — profiles, pack IDs and export destinations
- [Plugins](./plugins.md) — module and script definitions
- [Stages](./stages.md) — transformations and input detection
