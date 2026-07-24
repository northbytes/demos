#!/bin/bash
# Portfolio placeholder imagery. Every one of these is a slot waiting for a real
# Delux job photo — see brand.md. Consistent look: same London housing stock,
# same overcast/interior-lit register as the hero sequence.
set -euo pipefail
cd "$(dirname "$0")"
OUT=../site/assets/img
mkdir -p "$OUT"

STYLE="Photorealistic UK interiors/architectural photography, natural light, realistic London Victorian terrace housing stock, understated and true to life, no people, no text, no signage, no watermarks, no logos."

gen () { # gen <file> <prompt>
  echo "=== $1 ==="
  local url
  url=$(higgsfield generate create nano_banana_2 \
    --prompt "$2 $STYLE" --aspect_ratio 4:3 --wait 2>&1 | tail -1)
  echo "$url"
  curl -sL -o "$OUT/$1" "$url"
}

gen work-anerley.jpg "Interior of a bright open-plan kitchen-diner in a London side-return extension. Handleless matt navy kitchen units along one wall, pale oak floor, a large glass roof lantern overhead, wide dark grey aluminium bi-fold doors open onto a small walled garden. Overcast daylight."
gen work-sydenham.jpg "Rear exterior of a London Victorian terraced house with a newly built flat-roof dormer loft conversion clad in dark grey zinc standing seam, two white casement windows in the dormer, original stock brick below, small garden in the foreground. Overcast daylight."
gen work-beckenham.jpg "Interior hallway and staircase of a refurbished Edwardian London semi. Freshly plastered and painted white walls, restored original balustrade and newel post, patterned original floor tiles in the hall, panelled doors, natural daylight from a stained glass front door."
gen work-crystalpalace.jpg "Interior of a compact London kitchen after a wall removal, with a painted steel beam visible in the ceiling line. Shaker style sage green units, quartz worktop, a small utility area with a stacked washer and dryer behind a doorway. Overcast daylight from a rear window."
gen work-penge.jpg "Interior of a small newly fitted London bathroom. Large format light grey porcelain wall tiles, a walk-in shower with a black frame glass screen, a white wall-hung basin unit, chrome heated towel rail, obscured glass window with daylight."
gen work-foresthill.jpg "A small insulated garden studio at the end of a narrow London terrace garden, dark stained timber cladding, wide glazed doors and a flat roof, warm interior light on, paved path leading to it, brick boundary walls either side, dusk."
gen contact-bg.jpg "Wide exterior view of a row of London Victorian terraced houses seen from the rear gardens, stock brick, chimney pots and TV aerials against an overcast sky, blue hour."

echo DONE; ls -la "$OUT"
