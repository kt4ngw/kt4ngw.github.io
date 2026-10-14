# kt4ngw.github.io

Source of Jian Tang's academic homepage, <https://kt4ngw.github.io>. It is a
statically exported Next.js site, originally based on the
[PRISM](https://github.com/xyjoey/PRISM) template.

## Editing content

Everything shown on the site lives in `content/`:

| File | What it controls |
| --- | --- |
| `config.toml` | Site URL, profile details, social links, navigation |
| `about.toml` | Homepage sections and research interests |
| `bio.md` | Homepage introduction |
| `news.toml` | News items (sorted by date automatically) |
| `publications.bib` | Publications; `selected={true}` features a paper on the homepage, `preview` names its image in `public/papers/` |
| `services.toml`, `awards.toml` | Services and Awards pages (dated entries, like `news.toml`) |

The CV page embeds `public/cv.pdf`; replace that file to update it.

Paper preview images are WebP. To add one (`cwebp` comes with `brew install webp`):

```bash
cwebp -near_lossless 60 -z 9 figure.png -o public/papers/NAME.webp
```

The site icon is `public/favicon.svg`; `public/favicon-32.png` and
`public/apple-touch-icon.png` are PNG copies of it for older browsers and iOS home
screens, so regenerate them if the icon changes.

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

The code started from PRISM and is released under the MIT License; see [LICENSE](LICENSE).
