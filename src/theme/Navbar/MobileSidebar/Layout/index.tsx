import type { ReactNode } from 'react';
import { useNavbarSecondaryMenu } from '@docusaurus/theme-common/internal';
import type { Props } from '@theme/Navbar/MobileSidebar/Layout';

// One pane. The drawer only opens where a docs sidebar exists, so its content is
// that sidebar; the site navigation stays in the header itself.
export default function NavbarMobileSidebarLayout({ header, primaryMenu }: Props): ReactNode {
  const { content } = useNavbarSecondaryMenu();
  return (
    <div className="navbar-sidebar">
      {header}
      <div className="navbar-sidebar__items">
        <div className="navbar-sidebar__item menu">{content ?? primaryMenu}</div>
      </div>
    </div>
  );
}
