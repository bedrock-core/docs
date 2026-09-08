import type { ReactNode } from 'react';
import Layout from '@theme/Layout';
import { Button } from '@site/src/components/ds';

export default function Showcase(): ReactNode {
  return (
    <Layout title="Showcase" description="Addons built with @bedrock-core.">
      <main style={{ maxWidth: 720, margin: '0 auto', padding: 'var(--space-16) var(--space-8)' }}>
        <h1>Showcase</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-body-lg)' }}>
          Addons built with <code>@bedrock-core</code>. Ship one and tell us on Discord to be listed here.
        </p>
        <Button variant="secondary" iconLeft="discord" href="https://bedrock-core.drav.dev/discord">
          Join Discord
        </Button>
      </main>
    </Layout>
  );
}
