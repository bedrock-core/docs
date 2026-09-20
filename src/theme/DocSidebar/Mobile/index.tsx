import { memo, type ReactNode } from 'react';
import clsx from 'clsx';
import { NavbarSecondaryMenuFiller, ThemeClassNames } from '@docusaurus/theme-common';
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal';
import DocSidebarItems from '@theme/DocSidebarItems';
import type { Props } from '@theme/DocSidebar/Mobile';
import SectionSwitcher from '../../../components/nav/SectionSwitcher';

// The drawer carries the same tree as the desktop sidebar, section switcher included.
function DocSidebarMobileMenu({ sidebar, path }: Props): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  return (
    <>
      <SectionSwitcher />
      <ul className={clsx(ThemeClassNames.docs.docSidebarMenu, 'menu__list')}>
        <DocSidebarItems
          items={sidebar}
          activePath={path}
          onItemClick={(item) => {
            if (item.type === 'category' && item.href) mobileSidebar.toggle();
            if (item.type === 'link') mobileSidebar.toggle();
          }}
          level={1}
        />
      </ul>
    </>
  );
}

function DocSidebarMobile(props: Props): ReactNode {
  return <NavbarSecondaryMenuFiller component={DocSidebarMobileMenu} props={props} />;
}

export default memo(DocSidebarMobile);
