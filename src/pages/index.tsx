import type { ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import PackageGrid from '../components/PackageGrid';
import { CodeTour, Cta, Features, Hero } from '../components/Home';

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title={siteConfig.title} description="A framework for Minecraft Bedrock addons that need to talk to each other.">
      <Hero />
      <main>
        <PackageGrid />
        <Features />
        <CodeTour />
        <Cta />
      </main>
    </Layout>
  );
}
