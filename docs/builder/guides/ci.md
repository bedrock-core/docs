---
sidebar_position: 9
description: "Build validated pack exports with locked dependencies in a CI runner."
---
# Build in CI

Run the project's builder profile after installing its locked dependencies.

## Install and build

Use Node.js 22.18 or newer and the package manager recorded by the project:

<PackageCommands
  npm={`npm ci
npx bc-builder build config.json build`}
  yarn={`yarn install --immutable
yarn bc-builder build config.json build`}
  pnpm={`pnpm install --frozen-lockfile
pnpm exec bc-builder build config.json build`}
/>

Replace `build` with the project's profile name. Export destinations should point to dedicated directories inside the CI workspace.

Commit authored sources and the lockfile. Builder generates editor declarations and local caches under `.bedrock-core/`; generated declarations are available after the first build. Run the project's typecheck and lint commands alongside the build.

## Collect exports and test

A failed step or validation returns a failure before packs are published. Collect the profile's export directories as workflow artifacts after a successful build.

For GameTests, build the project's test profile and pass its exported packs to [BDS runner](/docs/bds-runner). UI acceptance also requires the target Minecraft client; successful compilation and schema checks do not establish rendered behavior.

## Next steps

- [Commands](./commands.md) — profile selection and build exit behavior
- [Configuration](./configuration.md) — pack IDs and export destinations
- [BDS runner](/docs/bds-runner) — run headless GameTests
