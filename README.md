# kt4ngw.github.io

Source of Jian Tang's academic homepage, <https://kt4ngw.github.io>. It is a
statically exported Next.js site built on the [PRISM](https://github.com/xyjoey/PRISM)
template.

## Editing content

Everything shown on the site lives in `content/`:

| File | What it controls |
| --- | --- |
| `config.toml` | Site URL, profile details, social links, navigation |
| `about.toml` | Homepage sections and research interests |
| `bio.md`, `contact.md` | Homepage text |
| `news.toml` | News items (sorted by date automatically) |
| `publications.bib` | Publications; `selected={true}` features a paper on the homepage, `preview` names its image in `public/papers/` |
| `services.md`, `awards.md` | Services and Awards pages |

The CV page embeds `public/cv.pdf`; replace that file to update it.

Paper preview images are WebP. To add one (`cwebp` comes with `brew install webp`):

```bash
cwebp -near_lossless 60 -z 9 figure.png -o public/papers/NAME.webp
```

## Local development

Requires Node.js 22 (see `.nvmrc`).

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # static export to out/
```

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and
publishes `out/` to GitHub Pages (Settings → Pages → Source: GitHub Actions).

The visitor map is refreshed from Google Analytics by
`.github/workflows/update-visitors.yml`; see [docs/visitor-map.md](docs/visitor-map.md).

## License

The code is based on PRISM and released under the MIT License; see [LICENSE](LICENSE).
