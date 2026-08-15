# The scroll film — how `site/assets/transform.mp4` was made

Five stage images → four Seedance 2.0 start-frame→end-frame clips → stitched →
compressed for web. Built with the `before-and-after` + `scroll-background-video`
skills on **15 August 2026**.

Generated through the **Higgsfield MCP**, not the `higgsfield` CLI — the CLI on
this machine is not authenticated (`hf auth login` would fix it, but the MCP was
already authed so it wasn't needed).

## The arc — tree only

The first cut of this film was a whole-garden makeover (overgrown wasteland →
felling → turfing → planted garden). It was rejected and its stages deleted: for
a tree surgeon, landscaping beats dilute the pitch rather than widen it.

The shipped arc changes **nothing but the tree**. The lawn, borders, patio,
furniture, fence panels, log store, houses and sky are pixel-identical in all
five stages, which is the whole proposition: *take the tree down, leave the
garden untouched.*

| Clip | Runs | Start → end | What happens |
| :-- | :-- | :-- | :-- |
| 1 | 5s | `01-standing` → `02-crown` | Arborist walks in, climbs, strips the canopy |
| 2 | 5s | `02b-handoff` → `03-felling` | Last limbs off, brash cleared, bare trunk left |
| 3 | **10s** | `03b-handoff` → `04a-stump-nogrinder` | Trunk sectioned down to a stump, climber leaves |
| 4 | 5s | `04b-handoff` → `05-cleared` | Grinder walks in, stump ground out, everything cleared |

`*-handoff.png` files are **frames pulled out of the previous clip**, not
generated stages — see the join rule below. `04a-stump-nogrinder.png` is
`04-stump` with the grinder, operator and dust plume edited out.

**Clip 3 runs 10s, not 5.** Taking a whole trunk down is by far the biggest
state change in the film, and at 5s Seedance had no room to show discrete cuts —
it just shrank the trunk continuously, so it read as the tree *dissolving* rather
than being felled. Doubling the frames for the same change is the fix. Cost
scales linearly with duration (45 cr per 5s at 1080p/std), so this clip costs 90.

Because the clips are **not equal length**, `site/main.js` maps chapters through
an explicit `CHAPTER_AT = [0, 0.2, 0.4, 0.8, 1]` table (fractions of the film's
duration) instead of dividing evenly. Fractions rather than seconds so a
re-encode that nudges the duration can't desync the chapters. If you change any
clip's length, update that table.

## Two rules that made it work

1. **The anchor is stage 05, and everything chains backward from it.** Each
   edit takes the *previous stage's output* as its reference image — never the
   original twice. That's what holds the camera, framing and light.

2. **Background lock on every prompt.** Chaining holds the camera; it does not
   hold the backdrop. Every stage prompt ends with an explicit "EVERYTHING ELSE
   STAYS ABSOLUTELY IDENTICAL" clause naming the lawn, borders, plants, gravel,
   patio, furniture, fence, log store, rooftops, skyline, sky, light and colour
   temperature. Without it the sky re-rolls between stages and the finished film
   visibly flickers.

   The anchor was deliberately generated under **flat overcast light with a
   near-featureless pale sky** for the same reason — scattered golden-hour cloud
   re-rolls every single edit.

## The join rule — chain clips from real frames, not stage images

**The single biggest lesson from this build.** The obvious way to build the
sequence is to hand clip N the pair (stage N, stage N+1). That is what produced
the first cut, and it was visibly broken: at the clip 1 → clip 2 join the whole
canopy **grew back** and got stripped a second time.

Cause: Seedance weights the *prompt* over the *start image* when the two
disagree. Clip 2's prompt re-described the crown in detail ("the remaining
ragged crown… the last heavy leafy limbs are cut free"), so the model rendered a
full leafy canopy at frame 0 instead of the stripped stem the start image
actually showed — and then had to strip it all over again.

Two rules that fix it, both used here:

1. **Chain clip N+1 from the actual last frame of clip N**, extracted with
   ffmpeg and uploaded as the start image. Clips drift off their target end
   frame, so the stage image is *not* where the previous clip really finished.
   Chaining from the real frame makes the join continuous by construction.

   ```bash
   ffmpeg -i final-1.mp4 -vf "select=eq(n\,120)" -vsync 0 -frames:v 1 handoff.png
   ```

2. **The prompt must describe only the delta, and state the starting condition
   as already true.** Never re-describe the thing that has already been removed.
   Add an explicit monotonicity clause — here, "ABSOLUTELY NO FOLIAGE EVER
   RETURNS… the tree only ever gets smaller and barer, monotonically". Without
   it the model happily runs the change backwards to reach its end frame.

### Things must be removed, never allowed to shrink on their own

Two separate symptoms, one cause — asked to get from A to B, the model takes the
cheapest visual path, which is to morph rather than simulate:

- **The trunk dissolved.** Fixed by demanding discrete steps in the prompt: a
  distinct section is chainsawed off, *tips sideways, swings out on a rope and is
  lowered to the ground*, and only then is the trunk shorter — "between cuts the
  trunk holds completely still at its new height", plus the blunt negative "THE
  TRUNK MUST NEVER SIMPLY SHRINK, SINK, MELT, DISSOLVE, TELESCOPE, DISINTEGRATE
  OR FADE IN HEIGHT."
- **The stump grew back and the grinder vanished** mid-grind. Fixed with an
  explicit monotonicity clause ("THE STUMP ONLY EVER GETS SMALLER… at no point
  does any new wood appear on top of it or grow back out of the ground") and by
  requiring the machine to stay on screen ("the grinder and the operator both
  stay clearly visible the whole time they are working").

The general rule: **name the failure mode as a negative.** Describing only the
desired outcome is not enough — the model needs to be told which physically
wrong shortcut it is not allowed to take.

Related: **people must enter frame, not materialise.** Stage 01 had nobody and
stage 02 had a climber up the tree, so the first cut faded him into existence
mid-air. Fixed by making the entrance explicit — he walks in from the bottom
edge, crosses the lawn and ascends — plus a blunt negative: "he must never
simply appear, fade in, materialise or pop into existence already up the tree."

Verify joins by eye before stitching; it costs nothing:

```bash
ffmpeg -i final-1.mp4 -vf "select=eq(n\,120)" -vsync 0 -frames:v 1 end1.png
ffmpeg -i final-2.mp4 -vf "select=eq(n\,0)"          -frames:v 1 start2.png
```

## Gotchas hit on this build

- **Stage 03 and 04 disagreed on where the tree stood.** 04 was originally
  chained from 05 and put the stump up by the fence; 03 put the trunk mid-lawn.
  Fixed by regenerating **04 from 03** instead — chaining backward is the
  default, but the rule that actually matters is "chain from the neighbour you
  must match", and here that was 03.
- **First attempt at the "before" stage made the tree *sparser*, not bigger**,
  so the arc read as "dead tree → healthy tree". Fixed by making the size
  instruction emphatic and explicit ("MASSIVELY larger", "at least three times
  wider", "no cut ends anywhere").
- **One image edit hung in `in_progress` for ~8 minutes and then failed.** This
  is Higgsfield flakiness, not a prompt problem — resubmitting the identical
  job succeeded in 20s. Don't rewrite the prompt; just rerun it.
- **`generate_video_batch` refused all four jobs** with a "preset recommended"
  error. Resubmit each with the `declined_preset_id` it hands back.

## Costs

Images (`nano_banana_2`, auto-routed to `nano_banana_flash`, 1k, 16:9) are
negligible. Video is not:

| | per 5s clip | ×4 |
| :-- | --: | --: |
| `720p` / `fast` | 17.5 cr | 70 |
| `1080p` / `fast` | 17.5 cr | 70 |
| `1080p` / `std` | 45 cr | **180** |

`1080p`/`fast` costs the same as `720p`/`fast`, so there is never a reason to
draft at 720p. The shipped film is **`1080p` / `std`**.

## Stitch + web export

```bash
printf "file 'final-%d.mp4'\n" 1 2 3 4 > list.txt
ffmpeg -y -f concat -safe 0 -i list.txt -c copy sequence.mp4

# -g 15 is the important flag: the page scrubs this file on scroll, and without
# frequent keyframes dragging through it snaps to distant keyframes and looks
# broken. -an because it is a muted background. faststart so it streams.
ffmpeg -y -i sequence.mp4 -an \
  -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p \
  -g 15 -keyint_min 15 -sc_threshold 0 \
  -movflags +faststart -vf "scale=1600:-2" \
  ../site/assets/transform.mp4
```

`site/assets/poster.jpg` is stage 01 — it must match frame 0 of the film, or the
hero visibly jumps when the video finishes loading.

## Note on repo weight

Per the root `CLAUDE.md`: `video/` is source, never served. Only
`site/assets/transform.mp4` is requested by the page. If the Pages build gets
slow, move this directory out rather than pruning history.
