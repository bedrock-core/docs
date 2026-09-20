import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import { Icon } from '../../../../components/ds';
import nav from '../../../../components/nav/nav.module.css';
import styles from './styles.module.css';

const LINKS = [
  { href: 'https://github.com/bedrock-core/', icon: 'github', label: 'GitHub' },
  { href: 'https://bedrock-core.drav.dev/discord', icon: 'discord', label: 'Discord' },
];

// Left stays empty: it sits over the trigger, so a second tap there does nothing.
// The middle takes over the social links and the theme switch at the widths where
// the navbar drops them for space.
export default function NavbarMobileSidebarHeader(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  return (
    <div className={`navbar-sidebar__brand ${styles.header}`}>
      <span />
      <div className={styles.links}>
        {LINKS.map((l) => (
          <Link key={l.label} href={l.href} className={nav.iconLink} aria-label={l.label} title={l.label}>
            <Icon name={l.icon} size="lg" />
          </Link>
        ))}
        <NavbarColorModeToggle />
      </div>
      <button type="button" className={styles.close} aria-label="Close" onClick={() => mobileSidebar.toggle()}>
        <Icon name="x" size="lg" />
      </button>
    </div>
  );
}
