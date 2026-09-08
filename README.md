# EDOLUS

Self-hosted PlayCanvas build. Pure static files — no build step.

## Run locally

```bash
node server.js
```

Open http://localhost:5178 (needs `.wasm` MIME + HTTP range — `npx serve` and `file://` will not work; `server.js` handles both).

## Deploy to GitHub Pages

The repo already contains everything Pages needs:

- `.nojekyll` — stops Jekyll from stripping the `__*.js` boot files
- `.github/workflows/deploy.yml` — publishes the whole folder on every push to `main`

Steps:

1. Push this folder:

   ```bash
   git add -A
   git commit -m "Deploy config"
   git push -u origin main
   ```

2. On GitHub: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. The **Deploy to GitHub Pages** action runs (Actions tab). When it finishes, the site is at
   `https://<user>.github.io/<repo>/`.

Every later `git push` to `main` redeploys automatically.

## Notes

- All asset paths are relative, so the site works from any sub-path.
- Expected console noise: a few `404`s on `.webp` texture twins (engine falls back to `.basis`) and a benign `AbortError` from a background `<video>` pausing. Anything else = a missing file or wrong MIME.
