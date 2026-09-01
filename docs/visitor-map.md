# Visitor map setup

The visitor map is rendered locally from `public/visitor-map.json` and
`public/visitor-stats.json`. No analytics credentials are sent to the browser.

Configure these GitHub repository secrets:

- `GA_MEASUREMENT_ID`: the web stream ID, for example `G-ABC123DEF4`.
- `GA_PROPERTY_ID`: the numeric GA4 property ID.
- `GA_CREDENTIALS`: the complete JSON key for a Google service account that has
  Viewer access to the GA4 property.

The scheduled workflow updates the public aggregate once a day. To change the
reporting window, create the repository variable `GA_START_DATE`. It accepts a
GA4 relative value such as `30daysAgo` or an absolute date such as `2026-01-01`.
If it is omitted, the map shows the past 365 days.

After adding the secrets, run **Actions → Update visitor map → Run workflow**
once. Historical traffic is available only from the date the GA4 property began
collecting data.

To regenerate the static world geometry after changing the map script, run:

```bash
npm run build:visitor-map
```
