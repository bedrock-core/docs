import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import { categories, sections } from '../../data/sections';
import { Badge, Icon } from '../ds';
import styles from './switcher.module.css';

/** Sidebar header: names the current docs section and drops down to switch. */
export default function SectionSwitcher(): ReactNode {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const id = pathname.startsWith('/docs/') ? pathname.split('/')[2] : undefined;
  const current = sections.find((s) => s.id === id);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (ev: MouseEvent): void => {
      if (ref.current && !ref.current.contains(ev.target as Node)) setOpen(false);
    };
    const onKey = (ev: KeyboardEvent): void => {
      if (ev.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Centre the active row before paint. Sets scrollTop on the list alone,
  // since scrollIntoView would also scroll the sidebar and the page.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!open || !list) return;
    const active = list.querySelector<HTMLElement>('[aria-selected="true"]');
    if (active) list.scrollTop = active.offsetTop - (list.clientHeight - active.offsetHeight) / 2;
  }, [open]);

  if (!current) return null;
  const accent = categories.find((c) => c.id === current.category)?.accent ?? '--cat-framework';

  return (
    <div ref={ref} className={styles.switcher}>
      <button
        type="button"
        className={clsx(styles.trigger, open && styles.open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.dot} style={{ background: `var(${accent})` }} />
        <span className={styles.name}>{current.label}</span>
        <span className={styles.spacer} />
        {current.status !== 'planned' ? <Badge tone={current.status === '1.0' ? 'success' : current.status === '1.0-rc' ? 'info' : 'warning'}>{current.status}</Badge> : null}
        <Icon name="chevrons-up-down" size="sm" color="var(--text-faint)" />
      </button>
      {open ? (
        <div ref={listRef} className={styles.list} role="listbox">
          {categories.map((category) =>
            sections
              .filter((s) => s.category === category.id)
              .map((s) => {
                const planned = s.status === 'planned';
                return (
                  <Link
                    key={s.id}
                    to={planned ? undefined : `/docs/${s.id}`}
                    className={clsx(styles.row, s.id === current.id && styles.rowActive, planned && styles.rowPlanned)}
                    role="option"
                    aria-selected={s.id === current.id}
                    onClick={() => setOpen(false)}
                  >
                    <span className={styles.dotSm} style={{ background: `var(${category.accent})` }} />
                    {s.label}
                    <span className={styles.spacer} />
                    <span className={styles.cat}>{category.label}</span>
                  </Link>
                );
              }),
          )}
        </div>
      ) : null}
    </div>
  );
}
