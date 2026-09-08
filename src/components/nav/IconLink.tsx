import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { Icon } from '../ds';
import styles from './nav.module.css';

export interface IconLinkProps {
  href: string;
  /** Lucide or brand icon name. */
  icon: string;
  /** Accessible label, also the tooltip; the visible text in the mobile drawer. */
  label: string;
  mobile?: boolean;
}

/** Icon-only navbar link for GitHub, Discord and the like; icon plus text in the mobile drawer. */
export default function IconLink({ href, icon, label, mobile = false }: IconLinkProps): ReactNode {
  if (mobile) {
    return (
      <li className="menu__list-item">
        <Link href={href} className={`menu__link ${styles.mobileLink}`}>
          <Icon name={icon} size="sm" />
          {label}
        </Link>
      </li>
    );
  }
  return (
    <Link href={href} className={`${styles.iconLink} ${styles.desktopOnly}`} aria-label={label} title={label}>
      <Icon name={icon} size="lg" />
    </Link>
  );
}
