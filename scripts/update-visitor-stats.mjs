import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const credentialsValue = process.env.GA_CREDENTIALS;
const propertyValue = process.env.GA_PROPERTY_ID;

if (!credentialsValue || !propertyValue) {
  throw new Error('GA_CREDENTIALS and GA_PROPERTY_ID are required.');
}

const credentials = JSON.parse(credentialsValue);
const property = propertyValue.startsWith('properties/')
  ? propertyValue
  : `properties/${propertyValue}`;
const startDate = process.env.GA_START_DATE || '2020-10-14';
const endDate = process.env.GA_END_DATE || 'today';
const client = new BetaAnalyticsDataClient({ credentials });

const [userReport] = await client.runReport({
  property,
  metrics: [{ name: 'totalUsers' }],
  dateRanges: [{ startDate, endDate }],
});

const [countryReport] = await client.runReport({
  property,
  dimensions: [{ name: 'country' }],
  metrics: [{ name: 'totalUsers' }],
  dateRanges: [{ startDate, endDate }],
  orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
  limit: 250,
});

const normalizeCountries = (items) => items
  .map((row) => ({
    name: row.name ?? row.dimensionValues?.[0]?.value ?? '',
    value: Number(row.value ?? row.metricValues?.[0]?.value ?? 0),
  }))
  .filter((country) => country.name && country.name !== '(not set)' && country.value > 0)
  .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));

const visitors = Number(userReport.rows?.[0]?.metricValues?.[0]?.value || 0);
const countries = normalizeCountries(countryReport.rows || []);

const nextStats = {
  visitors,
  countries,
  startDate,
  endDate,
};

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(scriptDirectory, '..', 'public', 'visitor-stats.json');

if (fs.existsSync(outputPath)) {
  const currentStats = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  const currentComparableStats = {
    visitors: Number(currentStats.visitors || 0),
    countries: normalizeCountries(Array.isArray(currentStats.countries) ? currentStats.countries : []),
    startDate: currentStats.startDate,
    endDate: currentStats.endDate,
  };

  if (JSON.stringify(currentComparableStats) === JSON.stringify(nextStats)) {
    console.log(`Visitor statistics unchanged: ${visitors} visitors across ${countries.length} countries.`);
    process.exit(0);
  }
}

const stats = {
  ...nextStats,
  updatedAt: new Date().toISOString(),
};

fs.writeFileSync(outputPath, `${JSON.stringify(stats, null, 2)}\n`);
console.log(`Updated visitor statistics: ${visitors} visitors across ${countries.length} countries.`);
