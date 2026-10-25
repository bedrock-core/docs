---
sidebar_position: 4
description: "Use bc-builder to build, watch, inspect plans and preview Regolith configuration conversion."
---
# Commands

`bc-builder` runs the builder from an installed project dependency.

| Command | Behavior |
| --- | --- |
| `bc-builder build [config.json] [profile]` | Build, validate and export the selected profile |
| `bc-builder watch [config.json] [profile]` | Build and watch inputs, with sequential rebuilds |
| `bc-builder plan [config.json] [profile]` | Validate configuration and print the execution plan without loading plugins |
| `bc-builder migrate [config.json] [options]` | Preview supported Regolith configuration conversion without executing filters |

The config defaults to `config.json`; build, watch and plan default to profile `default`. Ctrl+C stops watch mode and cancels its active build. List available commands:

<PackageCommands
  npm="npx bc-builder --help"
  yarn="yarn bc-builder --help"
  pnpm="pnpm exec bc-builder --help"
/>

```json title="package.json"
{
  "scripts": {
    "build": "bc-builder build config.json build",
    "deploy": "bc-builder build config.json development",
    "watch": "bc-builder watch config.json development"
  }
}
```

For configuration conversion, `--help` lists metadata, profile, filter and destination mappings. Preview reports readiness and actionable diagnostics. `--write` writes a ready conversion and makes an in-place backup; it rejects source edits made after the preview. Pack manifests and project code are separate inputs and are not rewritten by conversion.

## Next steps

- [Configuration](./configuration.md) — define profiles and exports
- [Migrate from Regolith](./migration.md) — supported conversions, destination mappings and guarded writes
- [Watch and cache](./watch.md) — dependency tracking and reuse
- [`migrateRegolithConfig`](../api/migrateRegolithConfig.md) — programmatic configuration preview
