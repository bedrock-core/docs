import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { Icon } from '../ds';
import styles from './nav.module.css';

export interface IconNavProps {
  to: string;
  /** Lucide icon shown instead of the label on small screens. */
  icon: string;
  label: string;
  mobile?: boolean;
}

/** A left navbar link that is text on desktop and an icon on small screens. */
export default function IconNav({ to, icon, label, mobile = false }: IconNavProps): ReactNode {
  if (mobile) {
    return (
      <li className="menu__list-item">
        <Link to={to} className={`menu__link ${styles.mobileLink}`} activeClassName="menu__link--active">
          <Icon name={icon} size="sm" />
          {label}
        </Link>
      </li>
    );
  }
  return (
    <>
      <Link to={to} className={styles.navLink} activeClassName={styles.navLinkActive}>
        {label}
      </Link>
      <Link to={to} className={clsx(styles.iconLink, styles.iconNav)} aria-label={label} title={label}>
        <Icon name={icon} size="lg" />
      </Link>
    </>
  );
}
