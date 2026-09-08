import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import DocsMenu from '../../components/nav/DocsMenu';
import IconLink from '../../components/nav/IconLink';
import IconNav from '../../components/nav/IconNav';

// Extra navbar item types: `custom-docsMenu` (the package mega-menu) and
// `custom-iconLink` (icon-only external links).
export default {
  ...ComponentTypes,
  'custom-docsMenu': DocsMenu,
  'custom-iconLink': IconLink,
  'custom-iconNav': IconNav,
};
