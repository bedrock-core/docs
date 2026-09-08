import type { CSSProperties, ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { Icon } from './Icon';
import styles from './ds.module.css';

export { Icon } from './Icon';

/** Mono status pill for release state and stability markers. */
export interface BadgeProps {
  children?: ReactNode;
  tone?: 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger';
  style?: CSSProperties;
}
export function Badge({ children, tone = 'neutral', style }: BadgeProps): ReactNode {
  return (
    <span className={clsx(styles.badge, tone !== 'neutral' && styles[tone])} style={style}>
      {children}
    </span>
  );
}

/** Chip for package names and topics; the dot carries the package accent. */
export interface TagProps {
  children?: ReactNode;
  /** Colour of the leading dot: a `--pkg-*` or `--cat-*` token, or any CSS colour. */
  accent?: string;
  dot?: boolean;
  style?: CSSProperties;
}
export function Tag({ children, accent, dot = false, style }: TagProps): ReactNode {
  return (
    <span className={styles.tag} style={style}>
      {dot ? <span className={styles.dot} style={accent ? { background: accent } : undefined} /> : null}
      {children}
    </span>
  );
}

/** Key cap for shortcut hints. */
export function Kbd({ children }: { children?: ReactNode }): ReactNode {
  return <kbd className={styles.kbd}>{children}</kbd>;
}

/** Tile for one package in the home grid or a docs index. */
export interface PackageCardProps {
  /** Package name after the scope, e.g. `server`. */
  name: string;
  scope?: string;
  description?: string;
  /** Lucide icon name. */
  icon?: string;
  /** Any CSS colour; carries the 2px top rule, the glyph and the call to action. */
  accent?: string;
  /** Short release-state label, e.g. `pre-1.0`. `planned` dims the card and disables it. */
  status?: string;
  href?: string;
}
export function PackageCard({
  name,
  scope = '@bedrock-core/',
  description,
  icon = 'package',
  accent = 'var(--cat-framework)',
  status,
  href = '#',
}: PackageCardProps): ReactNode {
  const planned = status === 'planned';
  const tone = planned ? 'neutral' : status === '1.0' ? 'success' : 'warning';
  return (
    <Link
      to={planned ? undefined : href}
      className={clsx(styles.card, planned && styles.planned)}
      style={{ '--card-accent': accent } as CSSProperties}
      aria-disabled={planned || undefined}
    >
      <span className={styles.rule} />
      <div className={styles.head}>
        <span className={styles.glyph}>
          <Icon name={icon} size="md" />
        </span>
        <span className={styles.name}>
          <span className={styles.scope}>{scope}</span>
          {name}
        </span>
        <span className={styles.spacer} />
        {status ? <Badge tone={tone}>{status}</Badge> : null}
      </div>
      {description ? <p className={styles.desc}>{description}</p> : null}
      {planned ? null : (
        <span className={styles.cta}>
          Read the docs
          <span className={styles.arrow}>
            <Icon name="arrow-right" size="sm" />
          </span>
        </span>
      )}
    </Link>
  );
}

/** The standard action control: `primary` once per view, `secondary` for the paired action, `ghost` in dense toolbars. */
export interface ButtonProps {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'accentSoft';
  size?: 'sm' | 'md' | 'lg';
  /** Lucide icon name rendered before the label. */
  iconLeft?: string;
  /** Lucide icon name rendered after the label. */
  iconRight?: string;
  href?: string;
  onClick?: () => void;
  style?: CSSProperties;
}
export function Button({ children, variant = 'primary', size = 'md', iconLeft, iconRight, href, onClick, style }: ButtonProps): ReactNode {
  const className = clsx(styles.button, styles[size], styles[variant]);
  const iconSize = size === 'lg' ? 'lg' : 'sm';
  const body = (
    <>
      {iconLeft ? <Icon name={iconLeft} size={iconSize} /> : null}
      {children}
      {iconRight ? <Icon name={iconRight} size={iconSize} /> : null}
    </>
  );
  if (href) {
    return (
      <Link to={href} className={className} style={style}>
        {body}
      </Link>
    );
  }
  return (
    <button type="button" className={className} style={style} onClick={onClick}>
      {body}
    </button>
  );
}

/** Feature block for the home page's "what you get" grid: icon, title, body. */
export interface FeatureCardProps {
  icon?: string;
  title: string;
  children?: ReactNode;
  accent?: string;
}
export function FeatureCard({ icon = 'box', title, children, accent = 'var(--accent-solid)' }: FeatureCardProps): ReactNode {
  return (
    <div className={styles.feature}>
      <Icon name={icon} size="lg" color={accent} />
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureBody}>{children}</p>
    </div>
  );
}
