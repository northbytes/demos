# Northbytes demos

Demo sites shown at northbytes.org/demos (this repo is a git submodule of
[main-website](https://github.com/northbytes/main-website) at `frontend/public/demos`).

Each top-level directory is one demo and must contain a `demo.json`:

```json
{
  "title": "…",
  "description": "…",
  "industry": "…",
  "image": "relative/path/to/thumbnail.jpg",
  "path": "relative/path/to/index.html",
  "hidden": true
}
```

`index.json` at the repo root lists the demo directories to show on the site —
add your directory name there when adding a demo.

## Hidden demos

`"hidden": true` keeps a demo off the public /demos grid. The demo itself is
still served — the link works for anyone you send it to. Unlock the grid from
the button at the bottom of /demos to see hidden cards and copy their links.
