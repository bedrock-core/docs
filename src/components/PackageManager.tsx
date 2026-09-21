import type { ReactNode } from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

// Package-manager tabs. `groupId` keeps every instance on the site in sync
// with the reader's choice.
const managers = [
  { id: 'npm', label: 'npm' },
  { id: 'yarn', label: 'yarn' },
  { id: 'pnpm', label: 'pnpm' },
] as const;

type Manager = (typeof managers)[number]['id'];

function installLine(manager: Manager, pkgs: string, dev: boolean): string {
  switch (manager) {
    case 'npm':
      return `npm install ${dev ? '--save-dev ' : ''}${pkgs}`;
    case 'yarn':
      return `yarn add ${dev ? '--dev ' : ''}${pkgs}`;
    case 'pnpm':
      return `pnpm add ${dev ? '--save-dev ' : ''}${pkgs}`;
  }
}

function execLine(manager: Manager, cmd: string): string {
  switch (manager) {
    case 'npm':
      return `npx ${cmd}`;
    case 'yarn':
      return `yarn dlx ${cmd}`;
    case 'pnpm':
      return `pnpm dlx ${cmd}`;
  }
}

function ManagerTabs({
  line,
  language = 'bash',
}: {
  line: (manager: Manager) => string;
  language?: string;
}): ReactNode {
  return (
    <Tabs groupId="package-manager" queryString={false}>
      {managers.map((manager) => (
        <TabItem key={manager.id} value={manager.id} label={manager.label}>
          <CodeBlock language={language}>{line(manager.id)}</CodeBlock>
        </TabItem>
      ))}
    </Tabs>
  );
}

export interface InstallProps {
  /** One package, or several separated by spaces. */
  pkg: string;
  /** Install as a dev dependency. */
  dev?: boolean;
}

/** `npm install` / `yarn add` / `pnpm add` for one or more packages. */
export function Install({ pkg, dev = false }: InstallProps): ReactNode {
  return <ManagerTabs line={(manager) => installLine(manager, pkg, dev)} />;
}

export interface ExecProps {
  /** The package and arguments to run without installing, e.g. `@bedrock-core/cli`. */
  cmd: string;
}

/** `npx` / `yarn dlx` / `pnpm dlx` for a one-off command. */
export function Exec({ cmd }: ExecProps): ReactNode {
  return <ManagerTabs line={(manager) => execLine(manager, cmd)} />;
}

export interface PackageCommandsProps {
  npm: string;
  yarn: string;
  pnpm: string;
  language?: string;
}

/** Copyable command or configuration variants synchronized with the other package-manager tabs. */
export function PackageCommands({ npm, yarn, pnpm, language = 'bash' }: PackageCommandsProps): ReactNode {
  const commands = { npm, yarn, pnpm };

  return <ManagerTabs language={language} line={(manager) => commands[manager]} />;
}
