"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { BAILEY_FC } from "@/lib/sample-art";

/* The artwork step, shared by the garment configurator and the large-format
 * quote form. Both accept the same files and run the same preflight, so they
 * share one component rather than two that drift apart. */

const MAX_BYTES = 20 * 1024 * 1024;
const ACCEPT = ".png,.pdf,.ai,.svg";
const ACCEPT_RE = /\.(png|pdf|ai|svg)$/i;

export const fileSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? // Number() drops a trailing .0 — "34MB", not "34.0MB".
      `${Number((bytes / 1024 / 1024).toFixed(1))}MB`
    : `${Math.max(1, Math.round(bytes / 1024))}KB`;

export type Artwork = { name: string; size: string; url: string; revoke: boolean };

/* ponytail: canned preflight results — a real one runs on the press server
 * after upload. */
const CHECKS = [
  { k: "RESOLUTION", v: "300 DPI", tone: "good" as const },
  { k: "COLOUR MODE", v: "CMYK", tone: "good" as const },
  {
    k: "TRANSPARENT BACKGROUND",
    v: "No",
    tone: "warn" as const,
    fix: "There's a white box behind your logo. Send a version with a transparent background, or we'll trim it for you at proof stage.",
  },
];

function StatusDot({ tone }: { tone: "good" | "warn" }) {
  return (
    <span
      aria-hidden="true"
      className="mt-[5px] block size-2 shrink-0 rounded-full"
      style={{ background: tone === "good" ? "var(--press)" : "var(--amber)" }}
    />
  );
}

export function ArtworkDrop({
  value,
  onChange,
}: {
  value: Artwork | null;
  /** The parent owns the file, so it can revoke the object URL and — on the
   * product page — paint it onto the garment. */
  onChange: (next: Artwork | null) => void;
}) {
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  function takeFile(file: File | undefined) {
    if (!file) return;
    if (!ACCEPT_RE.test(file.name)) {
      setError(
        `We can't read ${file.name.split(".").pop()?.toUpperCase()} files. Send it as a PNG, PDF, AI or SVG.`,
      );
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(
        `That file's ${fileSize(file.size)}. The limit is 20MB — try exporting it as a flattened PDF.`,
      );
      return;
    }
    setError(null);
    onChange({
      name: file.name,
      size: fileSize(file.size),
      url: URL.createObjectURL(file),
      revoke: true,
    });
  }

  if (!value) {
    return (
      <>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            takeFile(e.dataTransfer.files?.[0]);
          }}
          className={`border border-dashed p-8 text-center transition-colors duration-wipe ease-squeegee ${
            error
              ? "border-amber"
              : dragging
                ? "border-magenta bg-paper"
                : "border-ink/35"
          }`}
        >
          <p className="t-utility leading-[1.7] opacity-70">
            DROP ARTWORK HERE — PNG, PDF, AI, SVG, 20MB MAX
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileRef.current?.click()}
            >
              Choose a file
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setError(null);
                onChange({
                  name: "bailey-fc-crest.svg",
                  size: "2.4MB",
                  url: BAILEY_FC,
                  revoke: false,
                });
              }}
            >
              Use a sample file
            </Button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept={ACCEPT}
            className="sr-only"
            onChange={(e) => {
              takeFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>

        {error && (
          <p role="alert" className="t-note mt-4 border-l-2 border-amber pl-3">
            {error}
          </p>
        )}
      </>
    );
  }

  return (
    <>
      <div className="flex items-start gap-4 border border-rule bg-paper p-4">
        <div className="size-16 shrink-0 border border-rule bg-wash">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value.url}
            alt="Your uploaded artwork"
            className="size-full object-contain"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-small font-medium">{value.name}</p>
          <p className="t-utility mt-2 opacity-60">{value.size}</p>
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="t-utility shrink-0 underline underline-offset-4 opacity-70 transition-opacity duration-wipe hover:opacity-100"
        >
          REMOVE
        </button>
      </div>

      <dl className="mt-4 border-t border-rule">
        {CHECKS.map((r) => (
          <div key={r.k} className="border-b border-rule py-3">
            <div className="flex items-start gap-3">
              <StatusDot tone={r.tone} />
              <dt className="t-utility flex-1 opacity-70">{r.k}</dt>
              <dd className={`t-utility ${r.tone === "warn" ? "text-amber" : ""}`}>
                {r.v.toUpperCase()}
              </dd>
            </div>
            {r.fix && (
              <p className="mt-3 pl-5 text-small leading-relaxed opacity-75">
                {r.fix}
              </p>
            )}
          </div>
        ))}
      </dl>
    </>
  );
}
