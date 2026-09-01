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
const startDate = process.env.GA_START_DATE || '365daysAgo';
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

const visitors = Number(userReport.rows?.[0]?.metricValues?.[0]?.value || 0);
const countries = (countryReport.rows || [])
  .map((row) => ({
    name: row.dimensionValues?.[0]?.value || '',
    value: Number(row.metricValues?.[0]?.value || 0),
  }))
  .filter((country) => country.name && country.name !== '(not set)' && country.value > 0);

const stats = {
  visitors,
  countries,
  startDate,
  endDate,
  updatedAt: new Date().toISOString(),
};

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.resolve(scriptDirectory, '..', 'public', 'visitor-stats.json');
fs.writeFileSync(outputPath, `${JSON.stringify(stats, null, 2)}\n`);
console.log(`Updated visitor statistics: ${visitors} visitors across ${countries.length} countries.`);
