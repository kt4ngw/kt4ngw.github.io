'use client';

import { useEffect, useMemo, useState } from 'react';

type MapPoint = [number, number, string];

interface VisitorMapData {
  viewBox: string;
  land: string;
  borders: string;
  points: Record<string, MapPoint>;
}

interface VisitorStats {
  visitors: number;
  countries: Array<{ name: string; value: number }>;
  startDate?: string;
  endDate?: string;
  updatedAt?: string | null;
}

interface PlottedCountry {
  name: string;
  value: number;
  point: MapPoint | null;
}

const MIN_RADIUS = 4;
const MAX_RADIUS = 20;

function simplifyCountryName(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s*&\s*/g, ' and ')
    .replace(/[^a-z0-9]+/g, '');
}

function bubbleRadius(value: number, max: number) {
  if (max <= 0) return MIN_RADIUS;
  return MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * Math.sqrt(value / max);
}

function flagEmoji(code?: string) {
  if (!code || !/^[a-z]{2}$/i.test(code)) return '·';
  return code
    .toUpperCase()
    .split('')
    .map((character) => String.fromCodePoint(127397 + character.charCodeAt(0)))
    .join('');
}

function describeRange(stats: VisitorStats) {
  if (stats.startDate === '365daysAgo' && stats.endDate === 'today') {
    return 'Past 365 days';
  }
  if (stats.startDate && stats.endDate) {
    return `${stats.startDate} – ${stats.endDate}`;
  }
  return 'Visitor locations';
}

export default function VisitorMap() {
  const [map, setMap] = useState<VisitorMapData | null>(null);
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      fetch('/visitor-map.json', { signal: controller.signal }).then((response) => {
        if (!response.ok) throw new Error(`visitor-map.json: ${response.status}`);
        return response.json() as Promise<VisitorMapData>;
      }),
      fetch('/visitor-stats.json', { signal: controller.signal }).then((response) => {
        if (!response.ok) throw new Error(`visitor-stats.json: ${response.status}`);
        return response.json() as Promise<VisitorStats>;
      }),
    ])
      .then(([mapData, visitorStats]) => {
        setMap(mapData);
        setStats(visitorStats);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.error('Visitor map unavailable:', error);
        setFailed(true);
      });

    return () => controller.abort();
  }, []);

  const countries = useMemo<PlottedCountry[]>(() => {
    if (!map || !stats) return [];

    const looseLookup = new Map<string, MapPoint>();
    Object.entries(map.points).forEach(([name, point]) => {
      const key = simplifyCountryName(name);
      if (!looseLookup.has(key)) looseLookup.set(key, point);
    });

    return (stats.countries || [])
      .filter((country) => country?.name && country.name !== '(not set)' && country.value > 0)
      .map((country) => ({
        name: country.name,
        value: country.value,
        point: map.points[country.name] || looseLookup.get(simplifyCountryName(country.name)) || null,
      }))
      .sort((left, right) => right.value - left.value);
  }, [map, stats]);

  if (failed) {
    return (
      <p className="visitor-map-note" role="status">
        Visitor data is temporarily unavailable.
      </p>
    );
  }

  if (!map || !stats) {
    return <div className="visitor-map-loading" aria-label="Loading visitor map" />;
  }

  const max = countries[0]?.value || 0;
  const plotted = countries.filter((country) => country.point);

  return (
    <div className="visitor-map-shell">
      <div className="visitor-map-summary">
        <span>{describeRange(stats)}</span>
        <strong>{stats.visitors.toLocaleString()} visitors</strong>
      </div>

      <svg
        className="visitor-map-svg"
        viewBox={map.viewBox}
        role="img"
        aria-label="World map of visitor locations"
        preserveAspectRatio="xMidYMid meet"
      >
        <path className="visitor-map-land" d={map.land} />
        <path className="visitor-map-borders" d={map.borders} />
        {plotted.map((country) => {
          const point = country.point as MapPoint;
          const active = activeCountry === country.name;
          return (
            <circle
              key={country.name}
              className={`visitor-map-bubble${active ? ' is-active' : ''}`}
              cx={point[0]}
              cy={point[1]}
              r={bubbleRadius(country.value, max)}
              tabIndex={0}
              role="img"
              aria-label={`${country.name}: ${country.value} visitors`}
              onMouseEnter={() => setActiveCountry(country.name)}
              onMouseLeave={() => setActiveCountry(null)}
              onFocus={() => setActiveCountry(country.name)}
              onBlur={() => setActiveCountry(null)}
            >
              <title>{`${country.name} — ${country.value}`}</title>
            </circle>
          );
        })}
      </svg>

      {countries.length > 0 ? (
        <ol className="visitor-map-ranking" aria-label="Top visitor countries">
          {countries.slice(0, 10).map((country) => {
            const active = activeCountry === country.name;
            const share = max > 0 ? Math.max(2, Math.round((country.value / max) * 100)) : 0;
            return (
              <li
                key={country.name}
                className={`visitor-map-row${active ? ' is-active' : ''}`}
                tabIndex={0}
                onMouseEnter={() => setActiveCountry(country.name)}
                onMouseLeave={() => setActiveCountry(null)}
                onFocus={() => setActiveCountry(country.name)}
                onBlur={() => setActiveCountry(null)}
              >
                <span className="visitor-map-flag" aria-hidden="true">
                  {flagEmoji(country.point?.[2])}
                </span>
                <span className="visitor-map-country" title={country.name}>{country.name}</span>
                <span className="visitor-map-value">{country.value.toLocaleString()}</span>
                <span className="visitor-map-bar" aria-hidden="true">
                  <span className="visitor-map-bar-fill" style={{ width: `${share}%` }} />
                </span>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="visitor-map-note">
          The map is ready. Visitor bubbles will appear after GA4 is connected.
        </p>
      )}
    </div>
  );
}
