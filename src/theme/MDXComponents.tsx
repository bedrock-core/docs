import MDXComponents from '@theme-original/MDXComponents';
import { Exec, Install } from '../components/PackageManager';
import { Badge, Icon, Kbd, PackageCard, Tag } from '../components/ds';

// Components every docs page can use without importing them.
export default {
  ...MDXComponents,
  Install,
  Exec,
  Badge,
  Tag,
  Kbd,
  Icon,
  PackageCard,
};
