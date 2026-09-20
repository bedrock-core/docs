import { memo, type ReactNode } from 'react';
import clsx from 'clsx';
import useIsBrowser from '@docusaurus/useIsBrowser';
import type { Props } from '@theme/ColorModeToggle';
import { Icon } from '../../components/ds';
import styles from './styles.module.css';

type Choice = Props['value'];

function nextMode(value: Choice, respectPrefersColorScheme: boolean): Choice {
  if (!respectPrefersColorScheme) return value === 'dark' ? 'light' : 'dark';
  if (value === null) return 'light';
  return value === 'light' ? 'dark' : null;
}

const LABEL: Record<string, string> = { light: 'light mode', dark: 'dark mode', system: 'system mode' };

// The same glyph set and the same icon box as every other control in the header.
// All three icons are rendered and picked by `data-theme-choice` on the root, so
// the right one shows before React hydrates.
function ColorModeToggle({ className, buttonClassName, respectPrefersColorScheme, value, onChange }: Props): ReactNode {
  const isBrowser = useIsBrowser();
  const label = LABEL[value ?? 'system'];
  return (
    <div className={clsx(styles.toggle, className)}>
      <button
        type="button"
        className={clsx(styles.button, buttonClassName)}
        onClick={() => onChange(nextMode(value, respectPrefersColorScheme))}
        disabled={!isBrowser}
        title={label}
        aria-label={`Switch between dark and light mode (currently ${label})`}
      >
        <span className={clsx(styles.icon, styles.light)}>
          <Icon name="sun" size="lg" />
        </span>
        <span className={clsx(styles.icon, styles.dark)}>
          <Icon name="moon" size="lg" />
        </span>
        <span className={clsx(styles.icon, styles.system)}>
          <Icon name="sun-moon" size="lg" />
        </span>
      </button>
    </div>
  );
}

export default memo(ColorModeToggle);
