import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { Icon } from '../ds';
import styles from './nav.module.css';

export interface IconLinkProps {
  href: string;
  /** Lucide or brand icon name. */
  icon: string;
  /** Accessible label, also the tooltip. */
  label: string;
}

/** Icon-only navbar link for GitHub, Discord and the like. */
export default function IconLink({ href, icon, label }: IconLinkProps): ReactNode {
  return (
    <Link href={href} className={styles.iconLink} aria-label={label} title={label}>
      <Icon name={icon} size="lg" />
    </Link>
  );
}
