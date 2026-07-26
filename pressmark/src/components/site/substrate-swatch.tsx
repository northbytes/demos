import { useId } from "react";
import { cn } from "@/lib/utils";

/* The substrates, drawn rather than photographed. Every one of these is a white
 * board or a white roll — what tells them apart in the hand is the surface, so
 * that's what gets drawn: scrim weave, flutes, sheen, cut edge, backing liner.
 *
 * Only the two repeating surfaces need SVG. The edges and sheens are layers. */

const BASE: Record<string, string> = {
  pvc: "#E4E7E1",
  foamex: "#F4F6F2",
  correx: "#E7EBE7",
  silk: "#F6F7F0",
  vinyl: "#EBEEEB",
};

/** Woven scrim (PVC) and twinwall flutes (Correx) — the only tiling surfaces. */
function Weave({ id, pid }: { id: string; pid: string }) {
  return (
    <svg aria-hidden="true" className="absolute inset-0 h-full w-full">
      <defs>
        {id === "pvc" ? (
          <pattern id={pid} width="7" height="7" patternUnits="userSpaceOnUse">
            <path
              d="M0 0h7M0 0v7"
              stroke="rgba(20,24,27,0.15)"
              strokeWidth="1.2"
              fill="none"
            />
          </pattern>
        ) : (
          <pattern id={pid} width="11" height="11" patternUnits="userSpaceOnUse">
            {/* Shadow line then highlight: each flute reads as a channel. */}
            <path d="M0 0v11" stroke="rgba(20,24,27,0.2)" strokeWidth="1.4" />
            <path d="M2.5 0v11" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
          </pattern>
        )}
      </defs>
      <rect width="100%" height="100%" fill={`url(#${pid})`} />
    </svg>
  );
}

export function SubstrateSwatch({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const pid = `sw-${id}-${useId().replace(/:/g, "")}`;

  return (
    <div
      aria-hidden="true"
      className={cn("grain relative overflow-hidden", className)}
      style={{ background: BASE[id] ?? BASE.foamex }}
    >
      {(id === "pvc" || id === "correx") && <Weave id={id} pid={pid} />}

      {/* Sheen — coated paper catches a soft band, gloss vinyl a hard one. */}
      {(id === "silk" || id === "vinyl") && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              id === "silk"
                ? "linear-gradient(128deg, transparent 18%, rgba(255,255,255,0.9) 44%, rgba(20,24,27,0.05) 60%, transparent 88%)"
                : "linear-gradient(52deg, transparent 12%, rgba(255,255,255,0.95) 36%, rgba(255,255,255,0.15) 52%, rgba(255,255,255,0.8) 74%, transparent 96%)",
          }}
        />
      )}

      {/* Machined edge — Foamex is cut solid, Correx opens its flutes. */}
      {(id === "foamex" || id === "correx") && (
        <div
          className="absolute inset-x-0 bottom-0 border-t border-ink/20 bg-ink/8"
          style={{ height: "13%" }}
        />
      )}

      {/* Sheet corner turning up (silk), backing liner peeling back (vinyl). */}
      {id === "silk" && (
        <div
          className="absolute right-0 bottom-0 size-[34%] bg-ink/10"
          style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
        />
      )}
      {id === "vinyl" && (
        <div
          className="absolute bottom-0 left-0 h-[42%] w-[38%] bg-ink/14"
          style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
        />
      )}
    </div>
  );
}
