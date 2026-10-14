---
sidebar_position: 7
description: "Build-time identities, semantic declarations and generated-file hashes for external UI testing tools."
---
# Test metadata

Expose compiled controls to testing and inspection tools through a versioned JSON contract.

## Author controls

Controls accept three optional declarations:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `testId` | `string` | absent | Case-sensitive identity, nonblank and at most 256 characters |
| `testRole` | `TestRole` | inferred | Semantic role for a custom control; does not change its input mechanism |
| `testName` | `string` | inferred | A declared name for tooling, separate from client-rendered text |

Use stable constants. These values are captured at build time and do not track
runtime state. `Screen`, `Form`, and `Container` also accept a screen `testId`.
Styled fields forward the declarations to the field rather than its label wrapper.

```tsx
import { Button, Panel, Screen, Text } from '@bedrock-core/ui';

export default function Settings() {
  return (
    <Screen testId="settings">
      <Panel>
        <Button testId="notifications" testRole="checkbox" testName="Notifications">
          <Text>Enable alerts</Text>
        </Button>
      </Panel>
    </Screen>
  );
}
```

Roles are `screen`, `button`, `checkbox`, `textbox`, `slider`, `combobox`,
`listbox`, `text`, `image`, and `group`. Duplicate IDs remain separate metadata
entries; tools must handle ambiguous matches. Test declarations are independent
of a field's `name`, a control's `id`, and a slot's `role`.

## Generate metadata

Enable `testMetadata` in the [ui-compiler stage](/docs/builder/guides/stages#ui-compilation):

```json title="bedrockCore.profiles.default.stages"
{ "ui-compiler": { "testMetadata": true } }
```

The stage writes `bedrock-core/test-metadata.json` in the selected resource pack. Disabling the option
removes that manifest. The UI documents, shared faces, form response ordering,
and compiled snapshots are unchanged.

Direct `compileScreen` and `compileFormScreen` calls accept the same option
and return optional `ScreenTestMetadata` as `compiled.testMetadata`.

## Import the contract

The testing entry point can be imported in Node without the Minecraft runtime:

```ts
import { TEST_METADATA_PATH, TEST_METADATA_VERSION } from '@bedrock-core/ui-compiler/testing';
import type {
  ScreenTestMetadata, TestControlMetadata, TestHost, TestInteraction,
  TestMetadataFile, TestMetadataManifest, TestMetadataScreen, TestName, TestRole,
} from '@bedrock-core/ui-compiler/testing';
```

`TEST_METADATA_PATH` is resource-pack-relative; `TEST_METADATA_VERSION` is `1`.
The package also exports a standalone JSON Schema. Load it through a resolver
for use with your JSON Schema validator:

```ts
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const schemaPath = createRequire(import.meta.url).resolve('@bedrock-core/ui-compiler/testing/schema');
const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
```

The main compiler entry point re-exports the same constants and metadata types.

## Manifest fields

| Field | Meaning |
| --- | --- |
| `schemaVersion` | Version of the JSON contract, also present on each screen |
| `producer` | `@bedrock-core/ui-compiler` |
| `files` | Resource-pack-relative UI paths and lowercase SHA-256 hashes of their exact bytes |
| `screens[].file` | Generated JSON UI file containing this screen |
| `screens[].source` | Source module provenance; does not contain JSX line locations |
| `screens[].metadata` | Screen identity (`addon:name`), namespace, host, optional screen test ID, and controls |

Each control records its generated `node`, semantic `role`, optional `testId`
and `name`, concrete `paths`, and `interaction`. Property paths start at the
document root, with array indexes encoded as strings. Shared definitions can
have distinct inline instance paths. Generated node names and paths describe
this build; use authored test IDs as identities across builds.

Name kinds distinguish literal text, translated keys, bound values, and authored
declarations. `testName` and styled field captions produce `declared` names.
All names are compiler declarations; an assertion about visible text needs
an independent client observation.

`interaction` identifies a concrete form button or native modal mechanism.
It does not guarantee that a tool supports an action, that a control is visible
or enabled, or that input reaches an application callback. A role override
does not change this field. Chest mechanisms and controls without one concrete
supported instance use `unsupported`. Dynamic factories and grids do not imply
stable runtime instance identities.

## Consume metadata

Tools validate the supported schema version and file hashes before using property
paths. Resolve only within the selected resource pack and the matching generated
document. Multiple matches require explicit disambiguation; selecting the first
match can address the wrong control.

Version 1 permits additional fields so tools can ignore additive metadata.
Tools provide their own locators, instrumentation, observation, and input
adapters. The compiler contract has no dependency on a particular runner.

## Next steps

- [Control props](../components/control-props.md) — shared component properties
- [ui-compiler stage](/docs/builder/guides/stages#ui-compilation) — settings and generated output
