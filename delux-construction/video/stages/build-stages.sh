#!/bin/bash
# Decompose the anchor backward into stage images. Each stage chains off the
# previous one's output so camera, framing and building position stay locked.
set -euo pipefail
cd "$(dirname "$0")"

# ponytail: one clause, appended to every prompt — background drift is the
# single biggest tell in a stitched timelapse. See before-and-after skill.
LOCK="Keep the background completely identical to the reference image: same sky, same cloud shapes and positions, same blue-hour time of day, same weather, same light direction, colour temperature and shadow softness, same horizon, same neighbouring terraced houses, rooftops, chimney pots, TV aerials, brick boundary walls and skyline. Only the subject of the edit changes. Do not change the view, the camera position, the lens or the framing."

gen () { # gen <out> <ref> <prompt>
  local out="$1" ref="$2" prompt="$3"
  echo "=== $out ==="
  local url
  url=$(higgsfield generate create nano_banana_2 \
    --prompt "$prompt $LOCK" --image "$PWD/$ref" \
    --aspect_ratio 16:9 --wait 2>&1 | tail -1)
  echo "$url"
  curl -sL -o "$out" "$url"
  ls -la "$out"
}

gen 04-firstfix.png 05-final.png \
"Show this rear extension at the first-fix stage, before any internal finishes. The brickwork, flat roof, dark grey aluminium bi-fold doors and glass roof lantern are all installed and weathertight. Through the glazing the interior is an unfinished shell: bare plasterboard and exposed timber studwork, a dusty concrete floor slab, loose electrical cables hanging from the ceiling joists, plastic back boxes and conduit fixed to the walls, copper and white plastic pipework runs for the plumbing, and a temporary festoon work light strung across the ceiling casting harsh cold white light instead of warm domestic lighting. The garden is still a working site: no lawn, no planting, no garden lighting, bare compacted soil and sand where the paving was, a stack of plasterboard sheets and a cement mixer standing on the ground."

gen 03-shell.png 04-firstfix.png \
"Show this extension earlier, at the brick shell stage. The London stock brick walls are built up to full height and the flat roof joists and plywood roof deck are on, but there is no glazing at all: the wide rear opening is a bare structural gap with a painted steel goalpost beam and props visible across it, and the roof lantern opening is an empty timber kerb covered with a sheet of polythene. No doors, no windows, no roof lantern glass. Aluminium tower scaffolding and a scaffold board platform stand against the extension, with a mortar board, buckets and stacked bricks on the ground. The interior is a dark empty shell with a rough concrete slab. The garden is bare churned mud with tyre ruts."

gen 02-foundation.png 03-shell.png \
"Show this at the foundation stage, before any walls are built. The extension is not there. In its place is an excavated rectangular footprint with deep trenches dug for trench-fill concrete foundations, poured grey concrete visible in the bottom of the trenches, steel reinforcement bar sticking up, and the first few courses of grey concrete blockwork laid up to damp proof course level around the perimeter. Heaps of excavated London clay spoil and a stack of concrete blocks sit on the churned mud, with a mini digger parked to one side. Behind the excavation the original two-storey Victorian brick rear elevation of the house is fully exposed and intact."

gen 01-before.png 02-foundation.png \
"Show this garden before any work at all has started. There is no extension and no excavation. The original two-storey Victorian brick rear elevation of the terraced house is fully visible, with a tired white uPVC back door and a small kitchen window at ground floor level, a cast iron soil pipe and an old grey satellite dish on the brickwork, and weathered paintwork. The garden is neglected: cracked and stained old concrete paving with weeds growing through the joints, patchy overgrown grass, a rotten timber fence panel leaning against the brick boundary wall, and an old plastic wheelie bin. Nothing is under construction."

echo "ALL STAGES DONE"
ls -la *.png
