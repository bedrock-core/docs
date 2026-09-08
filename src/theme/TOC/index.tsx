import type { ReactNode } from 'react';
import clsx from 'clsx';
import TOCItems from '@theme/TOCItems';
import type { Props } from '@theme/TOC';
import styles from './styles.module.css';

// A custom link class keeps TOCInline and TOCCollapsible out of the highlighter.
const LINK_CLASS_NAME = 'table-of-contents__link toc-highlight';
const LINK_ACTIVE_CLASS_NAME = 'table-of-contents__link--active';

/** The page outline, with a heading over it. */
export default function TOC({ className, ...props }: Props): ReactNode {
  return (
    <div className={clsx(styles.toc, 'thin-scrollbar', className)}>
      <div className={styles.title}>On this page</div>
      <TOCItems {...props} linkClassName={LINK_CLASS_NAME} linkActiveClassName={LINK_ACTIVE_CLASS_NAME} />
    </div>
  );
}
