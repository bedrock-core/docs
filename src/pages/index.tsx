import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const logoSrc = useBaseUrl('img/logo/title.png');

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={clsx('hero__title', styles.heroTitle)}>
          <img src={logoSrc} alt={siteConfig.title} className={styles.heroLogo} />
        </Heading>

        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p>Developing a future where addons interact between them</p>

        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/ui/get-started/overview">
            Start using @bedrock-core/ui
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="A framework for Minecraft Bedrock">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
