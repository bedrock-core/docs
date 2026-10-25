---
sidebar_position: 6
description: "Build addon UI with builder and use the minimal compiler integration entry."
---
# Build integration

Build addon screens through builder's [UI stage](/docs/builder/guides/stages#ui-compilation).

The stage uses the project's installed UI toolkit, compiles screen components, links every host and writes resource files, behavior host definitions and runtime registration into the staged packs. Screen sources are detected automatically; [stage settings](/docs/builder/guides/stages#ui-compilation) select additional modules, formatting and test metadata.

Addon code imports components and hooks from `@bedrock-core/ui`. Compiler code runs during the build.

## Compiler entry

The package entry supplies complete compilation and linking operations for build integrations:

| Export | Kind | Description |
| --- | --- | --- |
| `compileScreen` | Function | Compile one native container screen |
| `compileFormScreen` | Function | Compile one action or modal form screen |
| `buildUiPack` | Function | Link the complete screen set into resource documents and hook merges |

`ScreenSpec`, `FormScreenSpec`, `CompiledScreen`, `CompiledFormScreen` and `CompiledUiPack` describe the inputs and results. These operations use one addon namespace and the same installed runtime as the screen components.

## External testing tools

The versioned metadata types and schema are available through `@bedrock-core/ui-compiler/testing` and `@bedrock-core/ui-compiler/testing/schema`. [Test metadata](./testing.md) describes consuming them independently of the game runtime.
