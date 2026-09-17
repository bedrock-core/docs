import { useState, type ReactNode } from 'react';
import clsx from 'clsx';
import useBaseUrl from '@docusaurus/useBaseUrl';
import CodeBlock from '@theme/CodeBlock';
import { Badge, Button, FeatureCard, Icon } from '../ds';
import Stats from './Stats';
import styles from './home.module.css';

const DISCORD = 'https://bedrock-core.drav.dev/discord';
const GITHUB = 'https://github.com/bedrock-core/';

const TRUST = [
  { icon: 'shield-check', label: 'Type-safe by design' },
  { icon: 'package', label: 'Zero dependencies at runtime' },
  { icon: 'store', label: 'Marketplace ready', pending: true },
];

export function Hero(): ReactNode {
  const wordmark = useBaseUrl('img/logo/title.png');
  return (
    <header className={styles.hero}>
      <div className={styles.heroInner}>
        <img src={wordmark} alt="@bedrock-core" className={styles.wordmark} />
        <div className={styles.badges}>
          <Stats />
        </div>
        <h1 className={styles.headline}>Addons Better Connected</h1>
        <p className={styles.lede}>
          Addons run in isolated realms. <code>@bedrock-core</code> lets yours find each other, call each other,
          share state, and draw custom UI the whole world can use.
        </p>
        <div className={styles.actions}>
          <Button size="lg" iconRight="arrow-right" href="/docs/server">
            Get started
          </Button>
          <Button size="lg" variant="secondary" iconLeft="github" href={GITHUB}>
            GitHub
          </Button>
          <Button size="lg" variant="outline" iconLeft="discord" href={DISCORD}>
            Discord
          </Button>
        </div>
        <div className={styles.command}>
          <CodeBlock language="bash">npx @bedrock-core/cli</CodeBlock>
        </div>
        <ul className={styles.trust}>
          {TRUST.map((item) => (
            <li key={item.label} className={styles.trustItem}>
              <Icon name={item.icon} size="sm" color="var(--accent-alt)" />
              {item.label}
              {item.pending ? <Badge>soon</Badge> : null}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

export function SectionHead({ eyebrow, title, sub, wide = false }: { eyebrow: string; title: string; sub?: string; wide?: boolean }): ReactNode {
  return (
    <div className={clsx(styles.head, wide && styles.headWide)}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.title}>{title}</h2>
      {sub ? <p className={styles.sub}>{sub}</p> : null}
    </div>
  );
}

const FEATURES = [
  { icon: 'radio', title: 'Runtime discovery', accent: '--cat-framework', body: 'Register once. Every other bedrock-core addon in the world sees you, and you see them, the moment they load.' },
  { icon: 'arrow-left-right', title: 'Typed RPC', accent: '--cat-framework', body: 'Request/response calls to another addon, typed from the interface the peer publishes.' },
  { icon: 'database', title: 'Shared state', accent: '--cat-framework', body: 'A declared shape every realm mirrors locally as a typed tree. Reads are synchronous, writes broadcast a delta.' },
  { icon: 'layout-panel-left', title: 'JSX screens', accent: '--cat-ui', body: 'React-like components for forms and containers. Screens compile ahead of time; only state moves at runtime.' },
  { icon: 'sliders-horizontal', title: 'Config, guides and translations', accent: '--cat-data', body: 'Declare a settings schema, ship an MDX guide and a typed translation bundle; the shared UI renders all three for every addon in the world.' },
  { icon: 'terminal', title: 'One build chain', accent: '--cat-tooling', body: 'Regolith filters compile guides, localization and screens, bundle the scripts, and run your GameTests on a real dedicated server.' },
];

export function Features(): ReactNode {
  return (
    <div className={styles.sunken}>
      <section className={styles.wrap}>
        <SectionHead
          eyebrow="What you get"
          title="Cross-realm plumbing, already solved."
          sub="Six pieces that turn a pile of unrelated behavior packs into one coordinated world."
        />
        <div className={styles.features}>
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} accent={`var(${f.accent})`}>
              {f.body}
            </FeatureCard>
          ))}
        </div>
      </section>
    </div>
  );
}

const TOUR = [
  {
    id: 'register',
    label: 'Register',
    step: 'The economy addon declares itself',
    caption: 'One call brings the addon online: it validates the manifest, joins the world and starts every subsystem. The config schema becomes typed accessors and an in-game settings screen.',
    language: 'ts',
    code: `import { core } from '@bedrock-core/server';

export interface EconomyRPC {
  getBalance(params: { player: string }): number;
}

const { config } = core.register({
  manifest: { creator: 'drav0011', pack: 'economy', packName: 'Economy', version: '1.0.0' },
  config: {
    server: {
      economy: {
        startingBalance: { type: 'number', default: 100, min: 0, max: 10000, label: 'Starting Balance' },
      },
    },
  } as const,
});

core.rpc.serve<EconomyRPC>({
  getBalance: ({ player }) => balances.get(player) ?? config.server.economy.startingBalance.get(),
});`,
  },
  {
    id: 'call',
    label: 'Call',
    step: 'The shop addon calls it, without importing it',
    caption: 'The shop names economy as a dependency and waits for it to appear. The RPC client is typed from an interface the economy addon publishes; the two packs never share a module.',
    language: 'ts',
    code: `import { core } from '@bedrock-core/server';

core.register({
  manifest: {
    creator: 'drav0011', pack: 'shop', packName: 'Shop', version: '1.0.0',
    dependencies: ['drav0011_economy'],
  },
});

core.registry.onDependenciesSatisfied(async () => {
  const economy = core.rpc.typed<EconomyRPC>('drav0011_economy');
  const balance = await economy.getBalance({ player: 'Steve' });

  console.warn(\`[shop] balance: \${balance}\`);
});`,
  },
  {
    id: 'screen',
    label: 'Screen',
    step: 'A screen shows the result',
    caption: 'Screens are components. The runtime serializes the tree into a server form and the render pack draws it; ore-styled gives the vanilla look.',
    language: 'tsx',
    code: `import { render, Text } from '@bedrock-core/ui';
import { Button, Card } from '@bedrock-core/ore-styled';

function Shop({ balance }: { balance: number }) {
  return (
    <Card>
      <Text>{\`Balance: \${balance}\`}</Text>
      <Button onPress={({ player }) => buy(player)}>{'Buy'}</Button>
    </Card>
  );
}

render(() => <Shop balance={balance} />, player);`,
  },
];

export function CodeTour(): ReactNode {
  const [active, setActive] = useState(TOUR[0].id);
  const current = TOUR.find((t) => t.id === active) ?? TOUR[0];
  return (
    <section className={styles.wrap}>
      <div className={styles.tour}>
        <div>
          <SectionHead eyebrow="In practice" title="Two packs, no imports." sub="Register, call, show. Each addon ships on its own and finds the others at runtime." />
          <ol className={styles.steps}>
            {TOUR.map((t, i) => (
              <li key={t.id} className={clsx(styles.step, t.id === active && styles.stepOn)}>
                <span className={styles.stepNo}>0{i + 1}</span>
                <button type="button" className={styles.stepButton} onClick={() => setActive(t.id)}>
                  {t.step}
                </button>
              </li>
            ))}
          </ol>
          <Button variant="accentSoft" iconRight="arrow-right" href="/docs/server/installation#getting-two-addons-talking">
            Read the walkthrough
          </Button>
        </div>
        <div>
          <div className={styles.tabs}>
            {TOUR.map((t) => (
              <button
                key={t.id}
                type="button"
                className={clsx(styles.tab, t.id === active && styles.tabOn)}
                onClick={() => setActive(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className={styles.caption}>{current.caption}</p>
          <div className={styles.panes}>
            {TOUR.map((t) => (
              <div key={t.id} className={styles.pane} hidden={t.id !== active}>
                <CodeBlock language={t.language} showLineNumbers>
                  {t.code}
                </CodeBlock>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Cta(): ReactNode {
  return (
    <div className={styles.cta}>
      <section className={styles.wrap}>
        <h2 className={styles.ctaTitle}>Start with one package.</h2>
        <p className={styles.ctaSub}>Pin an exact version, and read the changelog before you upgrade.</p>
        <div className={styles.actions}>
          <Button size="lg" iconRight="arrow-right" href="/docs/server">
            Read the docs
          </Button>
          <Button size="lg" variant="secondary" iconLeft="discord" href={DISCORD}>
            Join Discord
          </Button>
        </div>
      </section>
    </div>
  );
}
