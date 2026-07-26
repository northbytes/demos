"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Empty, SectionHead } from "./account-shell";
import { useToday } from "@/lib/dates";
import { ARTWORK, READINESS, daysAgo, type ArtworkFile } from "@/lib/account";

/* Every file the shop holds for this account, flat, with the metadata a press
 * operator would read off it. The dot carries print-readiness and the note says
 * what to do about it — amber on paper is 1.8:1, so it marks a row and never
 * writes on one. */

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="t-note opacity-40">{k}</dt>
      <dd className="t-note mt-1 leading-[1.5]">{v}</dd>
    </div>
  );
}

function FileRow({ file }: { file: ArtworkFile }) {
  const today = useToday();
  const state = READINESS[file.readiness];

  return (
    <li className="border-b border-rule py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
        {/* A preview where there's one to draw, and the extension where there
            isn't — an AI or a PDF has no thumbnail we can honestly show. */}
        <div className="flex size-[56px] shrink-0 items-center justify-center border border-rule bg-wash p-2">
          {file.preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={file.preview} alt="" className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="t-note opacity-40">
              {file.name.split(".").pop()?.toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <span className="t-utility break-all">{file.name.toUpperCase()}</span>
            <span className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={`block size-2 shrink-0 rounded-full border ${state.dot}`}
              />
              <span className="t-note leading-none">{state.label}</span>
            </span>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            <Meta k="DIMENSIONS" v={file.size} />
            <Meta k="RESOLUTION" v={file.dpi} />
            <Meta k="COLOUR MODE" v={file.mode} />
            <Meta k="UPLOADED" v={daysAgo(today, file.added)} />
          </dl>

          <p className="mt-4 max-w-measure text-small leading-relaxed opacity-75">
            {file.note}
          </p>

          <p className="t-note mt-4 flex flex-wrap items-baseline gap-x-3 opacity-55">
            <span className="opacity-70">USED IN</span>
            {file.jobs.length === 0 ? (
              <span>NOT YET PRINTED</span>
            ) : (
              file.jobs.map((ref) => (
                <Link
                  key={ref}
                  href={`/account/orders/${ref}`}
                  className="link opacity-100"
                >
                  {ref}
                </Link>
              ))
            )}
          </p>
        </div>
      </div>
    </li>
  );
}

export function ArtworkLibrary() {
  const ready = ARTWORK.filter((a) => a.readiness === "ready").length;

  return (
    <>
      <SectionHead title="Artwork library" count={`${ARTWORK.length} FILES`}>
        Every file you&apos;ve sent us, checked at print size. {ready} of{" "}
        {ARTWORK.length} are ready to go on a garment as they are — the rest tell
        you what they need.
      </SectionHead>

      {ARTWORK.length === 0 ? (
        <div className="mt-8">
          <Empty
            title="No artwork uploaded yet."
            action={
              <Button asChild>
                <Link href="/products/classic-heavy-tee">Upload artwork</Link>
              </Button>
            }
          >
            Anything you send us gets checked at print size and kept here —
            resolution, colour mode and the jobs it&apos;s been printed on.
          </Empty>
        </div>
      ) : (
        <ul className="mt-8 border-t border-rule">
          {ARTWORK.map((f) => (
            <FileRow key={f.name} file={f} />
          ))}
        </ul>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Button variant="secondary" asChild>
          <Link href="/products/classic-heavy-tee">Upload a new file</Link>
        </Button>
      </div>
    </>
  );
}
