import type { ReactNode } from 'react';
import { categories, sectionsOf } from '../../data/sections';
import { PackageCard } from '../ds';
import { SectionHead } from '../Home';
import styles from './styles.module.css';

/** The home-page package grid: one column per category, one card per section. */
export default function PackageGrid(): ReactNode {
  return (
    <section id="packages" className={styles.grid}>
      <div className="container">
        <SectionHead
          wide
          eyebrow="Packages"
          title="One scope, four categories."
          sub="Install the meta-package for a matching set, or take the layers you need on their own."
        />
        <div className={styles.columns}>
          {categories.map((category) => (
            <div key={category.id} className={styles.column}>
              <h2 className={styles.eyebrow} style={{ color: `var(${category.text})` }}>
                {category.label}
              </h2>
              {sectionsOf(category.id).map((section) => (
                <PackageCard
                  key={section.id}
                  name={section.label}
                  description={section.description}
                  icon={section.icon}
                  accent={`var(${category.accent})`}
                  accentText={`var(${category.text})`}
                  status={section.status}
                  href={`/docs/${section.id}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
