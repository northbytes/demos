#!/bin/bash
# Stitch the four clips and export the web build. Pass "final" to use the std
# 1080p renders; default stitches the fast drafts.
set -euo pipefail
cd "$(dirname "$0")"

PREFIX="${1:-draft}"
[ "$PREFIX" = "final" ] || PREFIX=draft

printf "file '%s-%d.mp4'\n" $PREFIX 1 $PREFIX 2 $PREFIX 3 $PREFIX 4 > list-$PREFIX.txt
ffmpeg -v error -y -f concat -safe 0 -i list-$PREFIX.txt -c copy sequence-$PREFIX.mp4

# Web build: no audio track, CRF 28, faststart so it starts streaming before the
# whole file lands. The hero scrubs this file, so keyframe every 15 frames —
# without it, dragging the rail snaps to distant keyframes and looks broken.
ffmpeg -v error -y -i sequence-$PREFIX.mp4 -an \
  -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p \
  -g 15 -keyint_min 15 -sc_threshold 0 \
  -movflags +faststart -vf "scale=1600:-2" \
  ../site/assets/build.mp4

ls -la sequence-$PREFIX.mp4 ../site/assets/build.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 ../site/assets/build.mp4
