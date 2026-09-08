import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { categories, publishedSections, sectionsOf } from '../../data/sections';
import styles from './styles.module.css';

const community = [
  { label: 'GitHub', href: 'https://github.com/bedrock-core/' },
  { label: 'Discord', href: 'https://bedrock-core.drav.dev/discord' },
  { label: 'npm', href: 'https://www.npmjs.com/org/bedrock-core' },
];

// Site footer: wordmark and tagline on the left, one column per category on
// the right, copyright on a hairline. Columns come from src/data/sections.ts.
export default function Footer(): ReactNode {
  const wordmark = useBaseUrl('img/logo/title.png');
  const live = new Set(publishedSections.map((s) => s.id));
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link to="/">
            <img src={wordmark} alt="@bedrock-core" className={styles.wordmark} />
          </Link>
          <p className={styles.tagline}>Addons Better Connected</p>
        </div>
        <span className={styles.spacer} />
        {categories.map((category) => (
          <div key={category.id} className={styles.col}>
            <div className={styles.title}>{category.label}</div>
            {sectionsOf(category.id)
              .filter((section) => live.has(section.id))
              .map((section) => (
                <Link key={section.id} to={`/docs/${section.id}`} className={styles.link}>
                  {section.label}
                </Link>
              ))}
          </div>
        ))}
        <div className={styles.col}>
          <div className={styles.title}>Community</div>
          {community.map((item) => (
            <Link key={item.label} href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className={styles.bottom}>Copyright © {new Date().getFullYear()} @bedrock-core. Built with Docusaurus.</div>
    </footer>
  );
}
