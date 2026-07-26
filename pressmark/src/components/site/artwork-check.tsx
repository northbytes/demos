"use client";

import * as React from "react";
import { ArtworkDrop, type Artwork } from "./artwork-drop";

/* Nothing here but state ownership. The panel is the same ArtworkDrop the
 * configurator and the large-format quote use — the point of this section is
 * that you can run the real check before you start an order, so a second
 * lookalike panel would defeat it. */
export function ArtworkCheck() {
  const [artwork, setArtwork] = React.useState<Artwork | null>(null);

  const replaceArtwork = React.useCallback((next: Artwork | null) => {
    setArtwork((old) => {
      if (old?.revoke) URL.revokeObjectURL(old.url);
      return next;
    });
  }, []);

  // Object URLs outlive the component unless they're handed back.
  React.useEffect(
    () => () => {
      if (artwork?.revoke) URL.revokeObjectURL(artwork.url);
    },
    [artwork],
  );

  return <ArtworkDrop value={artwork} onChange={replaceArtwork} />;
}
