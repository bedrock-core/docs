import { useEffect, useState, type ReactNode } from 'react';
import { Badge } from '../ds';

const REPOS = ['server', 'ui', 'regolith-filters', 'bds-runner'];
const PACKAGES = [
  'server', 'server-runtime', 'sync', 'ui', 'ui-runtime', 'ore-styled', 'navigation',
  'flexbox', 'i18n', 'guides', 'config', 'cli',
];
const CACHE = 'bedrock-core:stats';

interface Stats {
  stars?: number;
  downloads?: number;
}

function compact(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n);
}

async function sum(urls: string[], pick: (json: Record<string, unknown>) => number): Promise<number | undefined> {
  const results = await Promise.all(
    urls.map(async (url) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(url);
      return pick((await res.json()) as Record<string, unknown>);
    }),
  );
  return results.reduce((a, b) => a + b, 0);
}

/** Live counters under the wordmark: GitHub stars, npm downloads, package count. */
export default function Stats(): ReactNode {
  const [stats, setStats] = useState<Stats>({});

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(CACHE);
      if (cached) {
        setStats(JSON.parse(cached) as Stats);
        return;
      }
    } catch {
      /* storage unavailable */
    }
    const next: Stats = {};
    void Promise.allSettled([
      sum(REPOS.map((r) => `https://api.github.com/repos/bedrock-core/${r}`), (j) => Number(j.stargazers_count ?? 0)).then((v) => {
        next.stars = v;
      }),
      sum(PACKAGES.map((p) => `https://api.npmjs.org/downloads/point/last-month/@bedrock-core/${p}`), (j) => Number(j.downloads ?? 0)).then((v) => {
        next.downloads = v;
      }),
    ]).then(() => {
      setStats({ ...next });
      try {
        sessionStorage.setItem(CACHE, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
    });
  }, []);

  return (
    <>
      <Badge tone="warning">pre-1.0</Badge>
      <Badge tone="neutral">MIT</Badge>
      <Badge tone="neutral">{PACKAGES.length} packages</Badge>
      {stats.stars !== undefined ? <Badge tone="accent">★ {compact(stats.stars)} stars</Badge> : null}
      {stats.downloads !== undefined ? <Badge tone="info">{compact(stats.downloads)} downloads / month</Badge> : null}
    </>
  );
}
