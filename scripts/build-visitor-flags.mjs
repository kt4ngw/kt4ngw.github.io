import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import countries from 'world-countries/countries.json' with { type: 'json' };

const require = createRequire(import.meta.url);
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.dirname(require.resolve('world-countries/package.json'));
const outputDirectory = path.join(projectRoot, 'public', 'flags');

await fs.mkdir(outputDirectory, { recursive: true });

let totalBytes = 0;
for (const country of countries) {
  const source = path.join(sourceRoot, 'data', `${country.cca3.toLowerCase()}.svg`);
  const destination = path.join(outputDirectory, `${country.cca2.toLowerCase()}.png`);
  // Four-times display resolution stays crisp on high-DPI screens. Transparent
  // padding preserves each flag's shape, including non-rectangular flags.
  const result = await sharp(source)
    .resize(80, 60, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(destination);
  totalBytes += result.size;
}

console.log(`Generated ${countries.length} local visitor flags (${Math.round(totalBytes / 1024)} KB).`);
