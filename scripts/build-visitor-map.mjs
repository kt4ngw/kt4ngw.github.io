import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import countries from 'world-countries/countries.json' with { type: 'json' };

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const atlasPath = path.join(projectRoot, 'node_modules', 'world-atlas', 'countries-110m.json');
const outputPath = path.join(projectRoot, 'public', 'visitor-map.json');

const topology = JSON.parse(fs.readFileSync(atlasPath, 'utf8'));
topology.objects.countries.geometries = topology.objects.countries.geometries
  .filter((geometry) => String(geometry.id).padStart(3, '0') !== '010');

const land = feature(topology, topology.objects.countries);
const borders = mesh(topology, topology.objects.countries, (left, right) => left !== right);
const width = 1000;
const height = 480;
const projection = geoNaturalEarth1().fitExtent([[8, 8], [width - 8, height - 8]], land);
const drawPath = geoPath(projection);
const compactPath = (value) => value.replace(/-?\d+(\.\d+)?/g, (match) => String(Math.round(Number(match))));

const points = {};
const addPoint = (name, point) => {
  const key = String(name || '').trim();
  if (key.length >= 2 && !points[key]) points[key] = point;
};

for (const country of countries) {
  const [latitude, longitude] = country.latlng || [];
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) continue;

  const projected = projection([longitude, latitude]);
  if (!projected) continue;

  const point = [Math.round(projected[0]), Math.round(projected[1]), country.cca2.toLowerCase()];
  addPoint(country.name.common, point);
  addPoint(country.name.official, point);
  addPoint(country.cca2, point);
  for (const alternative of country.altSpellings || []) addPoint(alternative, point);
}

const analyticsAliases = {
  'Czech Republic': 'Czechia',
  Turkey: 'Türkiye',
  'Myanmar (Burma)': 'Myanmar',
  'Congo - Kinshasa': 'DR Congo',
  'Congo - Brazzaville': 'Republic of the Congo',
  Macao: 'Macau',
  'Macao SAR China': 'Macau',
  'Hong Kong SAR China': 'Hong Kong',
  'Cape Verde': 'Cabo Verde',
  Swaziland: 'Eswatini',
  Macedonia: 'North Macedonia',
  'U.S. Virgin Islands': 'United States Virgin Islands',
};

for (const [analyticsName, knownName] of Object.entries(analyticsAliases)) {
  if (points[knownName]) addPoint(analyticsName, points[knownName]);
}

const output = {
  width,
  height,
  viewBox: `0 0 ${width} ${height}`,
  land: compactPath(drawPath(land)),
  borders: compactPath(drawPath(borders)),
  points,
};

fs.writeFileSync(outputPath, JSON.stringify(output));
console.log(`Wrote ${path.relative(projectRoot, outputPath)} (${Math.round(fs.statSync(outputPath).size / 1024)} KB)`);
