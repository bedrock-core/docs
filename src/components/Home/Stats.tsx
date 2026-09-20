import { useEffect, useState, type ReactNode } from 'react';
import { Badge } from '../ds';

const ORG = 'bedrock-core';
const PACKAGES = [
  'server', 'server-runtime', 'sync', 'ui', 'ui-runtime', 'ore-styled', 'navigation',
  'flexbox', 'i18n', 'guides', 'config', 'cli',
];
const FIRST_PUBLISH = '2025-01-01';
const CACHE = 'bedrock-core:stats:v2';

interface Stats {
  stars?: number;
  downloads?: number;
}

function compact(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n);
}

async function json(url: string): Promise<Record<string, unknown>> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(url);
  return (await res.json()) as Record<string, unknown>;
}

/** Stars across every repository of the organization. */
async function orgStars(): Promise<number> {
  const repos = (await json(`https://api.github.com/orgs/${ORG}/repos?per_page=100&type=public`)) as unknown as Array<{ stargazers_count: number }>;
  return repos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);
}

/** All-time downloads across the published packages; npm ranges are capped at 18 months, so sum consecutive windows. */
async function totalDownloads(): Promise<number> {
  const windows: string[] = [];
  let start = new Date(FIRST_PUBLISH);
  const today = new Date();
  while (start < today) {
    const end = new Date(start);
    end.setMonth(end.getMonth() + 17);
    const last = end < today ? end : today;
    windows.push(`${start.toISOString().slice(0, 10)}:${last.toISOString().slice(0, 10)}`);
    start = new Date(last);
    start.setDate(start.getDate() + 1);
  }
  const counts = await Promise.all(
    PACKAGES.flatMap((p) => windows.map((w) => json(`https://api.npmjs.org/downloads/point/${w}/@${ORG}/${p}`).then((j) => Number(j.downloads ?? 0)))),
  );
  return counts.reduce((a, b) => a + b, 0);
}

/** Live counters under the wordmark: stars across the org, all-time npm downloads, package count. */
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
      orgStars().then((v) => {
        next.stars = v;
      }),
      totalDownloads().then((v) => {
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
      <Badge tone="warning">beta</Badge>
      <Badge tone="neutral">MIT</Badge>
      {stats.stars !== undefined ? <Badge tone="accent">★ {compact(stats.stars)} stars</Badge> : null}
      {stats.downloads !== undefined ? <Badge tone="info">{compact(stats.downloads)} downloads</Badge> : null}
    </>
  );
}
