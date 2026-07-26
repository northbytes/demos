# CLAUDE.md — northbytes/demos

Demo websites shown at **northbytes.org/demos**. Each one is a fake-brand site
for a different industry, used as a portfolio piece / sales tool.

This repo is **also a git submodule** of
[northbytes/main-website](https://github.com/northbytes/main-website) at
`frontend/public/demos`. Local checkout on Lucas's machine:
`~/Desktop/projects/demo-apps` (main-website is `~/Desktop/projects/northstar-systems`).

---

## Layout

One top-level directory per demo. Anything else at the root is infrastructure.

```
<slug>/
  demo.json      # required — metadata for the /demos card grid
  brand.md       # optional — the fake brand pack the site was built from
  site/          # required — what actually gets served
    index.html
    assets/
  video/         # optional — video SOURCE files (not served, see below)
  .hallmark/     # design-skill log, ignore
index.json       # list of demo dirs
.nojekyll        # tells GitHub Pages not to run Jekyll — do not delete
```

`demo.json`:

```json
{
  "title": "Delux Construction",
  "description": "One or two sentences shown on the card.",
  "industry": "Construction",
  "image": "site/assets/poster.jpg",   // thumbnail, relative to the demo dir
  "path": "site/index.html",           // entry page, relative to the demo dir
  "hidden": true                       // optional
}
```

`"hidden": true` keeps the card off the public grid. **It is not security** —
the demo stays served and any direct link works. That's deliberate: it's for
sending a client their demo before it's public. The /demos page has an unlock
strip at the bottom (passphrase `password`) to reveal hidden cards. The
passphrase lives in `UNLOCK_PASSWORD` in main-website's `Demos.tsx` — check
there rather than trusting this line, it has drifted before.

`index.json` lists the demo directory names. Keep it in sync when adding or
removing a demo.

### Two kinds of demo

- **Hand-written static HTML** (`builder`, `delux-construction`) — plain
  HTML/CSS/JS in `site/`. Edit the files, done. Use **relative** asset paths
  (`assets/foo.jpg`, not `/assets/foo.jpg`) since everything is served under
  `/demos/<slug>/site/`.
- **Next.js static export** (`oak-will-writers`, `pressmark`) — the app
  source lives in the demo dir; the Next config sets `output: "export"` and
  `basePath: "/demos/<slug>/site"`. Build, then copy the export into `site/`
  (this copy is manual — there's no script for it yet):

  ```bash
  cd t-shirt-printing && npm run build && rm -rf site && cp -r out site
  ```

  Pages serves this fine — nothing about Next needs a Node server once it's
  exported. The four things that bite when forking the pattern, all of them
  learned the hard way on `pressmark`:

  1. **`basePath` must match the final served path** or every asset 404s.
  2. **`trailingSlash: true`.** Next's client router normalises `/clothing` to
     `/clothing/`. Without this the export writes `clothing.html`, so the URL
     in the address bar 404s the moment anyone refreshes or shares it.
  3. **`basePath` does not touch raw strings.** `<Link>`, the router and
     `/_next/*` get prefixed; a plain `<a href="/x">` or `<img src="/img/y.jpg">`
     does not. Use `<Link>` for internal navigation, and run image paths
     through the `asset()` helper in `src/lib/utils.ts` (it reads
     `NEXT_PUBLIC_BASE_PATH`, which the Next config sets from the same
     constant).
  4. **`redirect()` needs a server.** A page that calls it exports as an error
     shell — silently, the build still passes. Render the content instead.

  A multi-page export is ~460 files. That's expected; only `site/` is served.

---

## Deployment — how demos go live

There are **two different paths** depending on what you changed. This matters:
one is ~1 minute and free, the other is a full production deploy.

### Path A — demo content changes (fast, no redeploy)

Editing HTML/CSS/JS/images/video inside any `<slug>/site/`:

```bash
git add . && git commit -m "…" && git push     # push to main
```

That's it. GitHub Pages is enabled on this repo (source: `main` branch, `/`
root), so a push triggers a Pages build automatically — no Actions workflow, no
secrets. Live on northbytes.org in **~1–2 minutes**.

**How it works:** nginx on the main site (`frontend/nginx.conf`) proxies
`/demos/<slug>/site/…` straight through to `https://northbytes.github.io`. The
repo is named `demos`, so its Pages base path is already `/demos/` and request
URIs pass through unchanged. Visitors only ever see `northbytes.org` URLs.

```
browser → northbytes.org/demos/x/site/  → Fly/nginx → northbytes.github.io/demos/x/site/
                                                       (this repo, main branch)
```

Verify a change is live and coming from Pages:

```bash
gh api repos/northbytes/demos/pages/builds/latest --jq '{status, commit}'
curl -sI https://northbytes.org/demos/oak-will-writers/site/index.html | grep -i "http/\|x-github-request-id"
```

An `x-github-request-id` header means the proxy is working.

### Path B — card grid changes (needs a main-site deploy)

Anything that changes **which demos exist or what the cards say** —
adding/removing a demo, or editing `demo.json` / `index.json`:

The /demos listing page is **prerendered at build time**. `Demos.tsx` reads
every `demo.json` via `import.meta.glob` so the card links exist in the raw
HTML for crawlers. A runtime fetch was tried and left the page empty for
crawlers, so this is intentional — the cost is that new demos need a deploy.

```bash
# 1. push the demo here first (Path A)
# 2. then in main-website:
cd ~/Desktop/projects/northstar-systems
git submodule update --remote frontend/public/demos
git add frontend/public/demos
git commit -m "Bump demos submodule: add <slug>"
# 3. PR into main — pushing to main runs typecheck+tests then deploys to Fly
```

Merging to `main` on main-website runs `.github/workflows/deploy.yml`: quick
tests (`tsc -b`, `vitest`) → `flyctl deploy --remote-only` → nginx image on
Fly. Takes ~3 minutes. The workflow checks out with `submodules: true`, which
is required — without it the glob matches nothing and the grid renders empty.

### Rules of thumb

| Change | Where | Live in |
|---|---|---|
| Edit a demo's pages, styles, images, video | push here | ~1–2 min |
| Add / remove a demo | push here **+** submodule bump + deploy | ~5 min |
| Edit a card title/description/thumbnail (`demo.json`) | push here **+** submodule bump + deploy | ~5 min |
| Toggle `hidden` | push here **+** submodule bump + deploy | ~5 min |

---

## Gotchas

- **Never delete `.nojekyll`.** Without it Pages runs Jekyll, which ignores
  files and directories starting with `_` — that would break the Next export
  (`site/_next/…`) immediately.
- **Demos are noindexed, not private.** Two layers, and both are needed:
  nginx sends `X-Robots-Tag: noindex` for `/demos/*/site/`, and every page in
  `site/` carries `<meta name="robots" content="noindex, follow">` in its head.
  The header alone only covers northbytes.org — the same files are served
  directly at `northbytes.github.io/demos/…`, where nothing of ours sets
  headers, so without the meta tag Google can index the demo on that host. The
  meta travels with the file, so it covers both. **New demo → make sure its
  pages carry it**: hand-written sites get the tag in `<head>`; Next exports get
  `robots: { index: false, follow: true }` in the root layout's `metadata`.
  Never add a robots.txt disallow — a page that can't be crawled can't be read
  as noindex. This is also a public repo, so never put anything real (client
  data, keys) in a demo.
- **GitHub Pages is in the serving path.** If Pages has an outage, demos fail
  while the rest of northbytes.org is fine. Check
  <https://www.githubstatus.com/api/v2/incidents/unresolved.json> before
  debugging a stuck build — a "building" status that never finishes is usually
  their incident, not the repo. A stuck build can be re-kicked with
  `gh api repos/northbytes/demos/pages/builds -X POST`.
- **`video/` source files are dead weight in the served site.** ~170MB of
  drafts, finals and stage PNGs are tracked but never requested — only the
  stitched `site/assets/build.mp4` is. They slow the Pages build and count
  against the 1GB Pages limit. If builds get slow, move `video/` out to a
  separate repo or release assets rather than pruning history.
- **Pages is org-gated.** Pages creation is an org-level setting on `northbytes`
  (`members_can_create_pages`). If enabling Pages on a new repo 422s, that's why.

---

## Conventions

- Demo brands are **fictional**. Generated via the `fake-brand` skill, kept in
  `brand.md` next to the site so copy can be regenerated consistently.
- Sites are designed with the `hallmark` skill (hence `.hallmark/log.json`).
- Scroll-scrubbed hero videos (`builder`, `delux-construction`) come from the
  `before-and-after` / `scroll-background-video` skills. On mobile they scrub on
  scroll rather than autoplay-looping.
- Verify demo changes in a real browser before calling them done — load the page
  through **northbytes.org** (not the local file), check the console, and confirm
  the Pages build finished first, or you'll be looking at the old version.
