import type { ReactNode } from 'react';
import Content from '@theme-original/DocSidebar/Desktop/Content';
import type ContentType from '@theme/DocSidebar/Desktop/Content';
import type { WrapperProps } from '@docusaurus/types';
import SectionSwitcher from '../../../../components/nav/SectionSwitcher';

type Props = WrapperProps<typeof ContentType>;

// The section switcher sits above every docs sidebar tree.
export default function ContentWrapper(props: Props): ReactNode {
  return (
    <>
      <SectionSwitcher />
      <Content {...props} />
    </>
  );
}
