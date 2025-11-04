import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'TypeScript First',
    Svg: require('@site/static/img/ts-logo.svg').default,
    description: (
      <>
        Strong typings, IntelliSense, and maintainable addon development.
      </>
    ),
  },
  {
    title: 'Zero Dependencies',
    Svg: require('@site/static/img/minecraft-logo.svg').default,
    description: (
      <>
        Designed to stay lightweight and dependency-free.
        Full control without unnecessary overhead.
      </>
    ),
  },
  {
    title: 'Cross-addon compatibility',
    Svg: require('@site/static/img/addons-logo.svg').default,
    description: (
      <>
        Addon cross compatibility as our core principle.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
