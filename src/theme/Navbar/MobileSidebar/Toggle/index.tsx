import type { ReactNode } from 'react';
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal';
import { Icon } from '../../../../components/ds';

// The drawer holds the section's page tree, so the trigger is a sidebar glyph
// rather than a hamburger. CSS shows it on docs pages only.
export default function MobileSidebarToggle(): ReactNode {
  const { toggle, shown } = useNavbarMobileSidebar();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Pages in this section"
      aria-expanded={shown}
      className="navbar__toggle"
    >
      <Icon name="panel-left" size="lg" />
    </button>
  );
}
