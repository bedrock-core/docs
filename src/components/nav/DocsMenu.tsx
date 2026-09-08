import { useEffect, useRef, useState, type ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import { categories, sectionsOf } from '../../data/sections';
import { Badge, Icon } from '../ds';
import styles from './nav.module.css';

/** In the mobile drawer the menu is a flat grouped list. */
function DocsMenuMobile({ activeId }: { activeId?: string }): ReactNode {
  return (
    <li className="menu__list-item">
      {categories.map((category) => (
        <div key={category.id} className={styles.mobileGroup}>
          <div className={styles.colHead}>
            <span className={styles.dot} style={{ background: `var(${category.accent})` }} />
            <span className={styles.colLabel}>{category.label}</span>
          </div>
          <ul className="menu__list">
            {sectionsOf(category.id)
              .filter((section) => section.status !== 'planned')
              .map((section) => (
                <li key={section.id} className="menu__list-item">
                  <Link
                    to={`/docs/${section.id}`}
                    className={clsx('menu__link', styles.mobileLink, section.id === activeId && 'menu__link--active')}
                  >
                    <Icon name={section.icon} size="sm" />
                    {section.label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </li>
  );
}

/** Header mega-menu: one column per category, one row per section. */
export default function DocsMenu({ label = 'Docs', mobile = false }: { label?: string; mobile?: boolean }): ReactNode {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const activeId = pathname.startsWith('/docs/') ? pathname.split('/')[2] : undefined;

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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (mobile) return <DocsMenuMobile activeId={activeId} />;

  return (
    <div ref={ref} className={clsx('navbar__item', styles.menu)}>
      <button
        type="button"
        className={clsx(styles.trigger, open && styles.open)}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.triggerIcon}>
          <Icon name="book-open" size="lg" />
        </span>
        <span className={styles.triggerLabel}>{label}</span>
        <span className={styles.chevron}>
          <Icon name="chevron-down" size="xs" />
        </span>
      </button>
      {open ? (
        <div className={styles.panel} role="menu">
          {categories.map((category) => (
            <div key={category.id} className={styles.col}>
              <div className={styles.colHead}>
                <span className={styles.dot} style={{ background: `var(${category.accent})` }} />
                <span className={styles.colLabel}>{category.label}</span>
              </div>
              {sectionsOf(category.id).map((section) => {
                const planned = section.status === 'planned';
                return (
                  <Link
                    key={section.id}
                    to={planned ? undefined : `/docs/${section.id}`}
                    className={clsx(styles.row, section.id === activeId && styles.rowActive, planned && styles.rowPlanned)}
                    onClick={() => setOpen(false)}
                    role="menuitem"
                    aria-disabled={planned || undefined}
                  >
                    <span className={styles.rowTitle}>
                      <span className={styles.rowName}>{section.label}</span>
                      {planned ? <Badge>planned</Badge> : null}
                    </span>
                    <span className={styles.rowDesc}>{section.description}</span>
                  </Link>
                );
              })}
            </div>
          ))}
          <Link to="/#packages" className={styles.all} onClick={() => setOpen(false)}>
            Browse all packages
            <Icon name="arrow-right" size="xs" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
