# Visitor country flags

These PNG images are rendered from the SVG flags distributed with
[`world-countries` 5.1.0](https://github.com/mledoze/countries/tree/v5.1.0/data).
The upstream project states that flag artwork is excluded from its database's
ODbL license; see its [license notes](https://github.com/mledoze/countries#license).

Regenerate from the installed dependencies with `npm run build:visitor-flags`.
Images use lowercase ISO country codes, cover all 250 entries in the source
dataset, and are committed so deployment and new visitor countries do not
require external image services. Each image is 80 x 60 pixels with transparent
padding to preserve the original flag proportions.
