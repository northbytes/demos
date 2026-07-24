#!/bin/bash
# Animate each adjacent stage pair. Pass "final" to render std/1080p; default is
# a fast 720p draft. Clip N takes stage N as first frame and stage N+1 as last.
set -euo pipefail
cd "$(dirname "$0")"

MODE="${1:-draft}"
if [ "$MODE" = "final" ]; then RES=1080p; SPEED=std; PREFIX=final; else RES=720p; SPEED=fast; PREFIX=draft; fi

# ponytail: same lock as the stage prompts — a drifting sky or a drifting camera
# turns four clips into four visibly different shots once stitched.
# ponytail: describe the camera's BEHAVIOUR, never the equipment — saying
# "on a tripod" made Seedance draw an actual tripod standing in the garden.
LOCK="Completely static locked-off shot with absolutely no camera movement: no push-in, no zoom, no pan, no tilt, no dolly and no drift at any point, and no camera equipment is visible in the scene. The framing, focal length and camera position in the final frame are exactly identical to the first frame. The sky, cloud shapes, blue-hour light, weather and background terraced houses stay completely static and identical throughout the entire clip. Only the building work changes. No cuts, no jumps, continuous real-time motion."

clip () { # clip <n> <start> <end> <motion>
  echo "=== $PREFIX-$1 ==="
  local url
  url=$(higgsfield generate create seedance_2_0 \
    --prompt "$4 $LOCK" \
    --start-image "$PWD/stages/$2" --end-image "$PWD/stages/$3" \
    --aspect_ratio 16:9 --resolution $RES --mode $SPEED \
    --duration 5 --generate_audio false --wait 2>&1 | tail -1)
  echo "$url"
  curl -sL -o "$PREFIX-$1.mp4" "$url"
  ls -la "$PREFIX-$1.mp4"
}

clip 1 01-before.png 02-foundation.png \
"Realistic construction timelapse. The neglected rear yard is cleared and excavated: the old cracked concrete paving and weeds are broken out and carted away, the leaning fence panel and wheelie bin are removed, a mini digger tracks in and cuts deep foundation trenches into the London clay, spoil is heaped to one side, concrete is poured into the trenches and grey blockwork is laid up to damp proof course level. Groundworkers in hi-vis and hard hats move through the frame carrying tools and barrows."

clip 2 02-foundation.png 03-shell.png \
"Realistic construction timelapse. The foundations become a brick shell: London stock brickwork rises course by course around the perimeter, a painted red steel goalpost beam is craned into position across the rear opening and propped with acrow props, timber roof joists and a plywood flat roof deck are laid over the top, and aluminium tower scaffolding is wheeled into place against the walls. Bricklayers in hi-vis work along the walls, buckets and mortar boards accumulate on the ground."

clip 3 03-shell.png 04-firstfix.png \
"Realistic construction timelapse. The open shell is closed in and first-fixed: a large glass roof lantern is lowered into the roof kerb, wide dark grey aluminium bi-fold doors are lifted into the rear opening and glazed, the scaffolding is struck and wheeled away. Inside, visible through the new glazing, electricians run cables and fix back boxes to timber studwork while plumbers install copper and plastic pipework, and a festoon work light flicks on and lights the interior with cold white light. Plasterboard sheets are stacked outside and a cement mixer is wheeled in."

clip 4 04-firstfix.png 05-final.png \
"Realistic construction timelapse. The finished handover: the cold festoon work light is replaced by warm domestic lighting glowing through the glass, the interior is plastered, painted and floored, the cement mixer and plasterboard stack are cleared away, grey porcelain paving slabs are laid across the yard, a strip of lawn is rolled out, planting beds are filled with ferns and shrubs, and low garden lights switch on. Landscapers place the final slabs and plants, then leave the frame."

echo "ALL CLIPS DONE"
ls -la $PREFIX-*.mp4
