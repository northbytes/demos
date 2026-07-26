import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BasketLink } from "./basket-link";

const NOTICES = [
  "FREE UK DELIVERY OVER £75",
  "PROOFS BACK SAME WORKING DAY",
  "COLLECT IN MEDWAY",
];

const LINKS = [
  { label: "Clothing", href: "/clothing" },
  { label: "Large format", href: "/large-format" },
  { label: "Occasions", href: "/occasions/stag-and-hen" },
  { label: "Artwork help", href: "/artwork" },
  { label: "Track your order", href: "#" },
];

/* Icons are drawn at the rule weight rather than pulled from a set, so they
 * sit at the same hairline as everything else. */
function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <circle
        cx="8"
        cy="8"
        r="5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path d="M12 12 16.5 16.5" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

function IconAccount() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <circle
        cx="9"
        cy="6"
        r="3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M2.5 16c0-3.6 2.9-5.5 6.5-5.5s6.5 1.9 6.5 5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  );
}

function IconButton({
  label,
  href,
  children,
}: {
  label: string;
  /** Renders a link when there's somewhere to go; a button otherwise. */
  href?: string;
  children: React.ReactNode;
}) {
  const className =
    "relative flex size-8 items-center justify-center text-ink transition-colors duration-wipe ease-squeegee hover:text-magenta";

  return href ? (
    <Link href={href} aria-label={label} className={className}>
      {children}
    </Link>
  ) : (
    <button type="button" aria-label={label} className={className}>
      {children}
    </button>
  );
}

/* The small footer the interior pages carry — the homepage has its own, much
 * bigger one. Lives here so the shell is one import per page. */
export function SiteFooter({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`on-dark border-t border-rule-dk bg-press text-wash ${className}`}
    >
      <div className="shell flex h-[64px] items-center justify-between gap-6">
        <span className="t-utility opacity-60">© 2026 PRESSMARK</span>
        <span className="t-utility opacity-60">MADE IN KENT</span>
      </div>
    </footer>
  );
}

export function SiteNav() {
  return (
    <>
      {/* ── Announcement bar ──────────────────────────────────────────────── */}
      <div className="on-dark h-[36px] bg-press text-wash">
        <div className="shell flex h-full items-center justify-center">
          {/* Borders sit on the items themselves — `divide-x` would leave a
              dangling rule when the last two are hidden on small screens. */}
          <ul className="flex h-full items-center">
            {NOTICES.map((n, i) => (
              <li
                key={n}
                className={`t-utility px-6 ${
                  i > 0 ? "hidden border-l border-rule-dk sm:block" : ""
                }`}
              >
                {n}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Navigation — sticky, but it never shrinks or blurs ────────────── */}
      <header className="sticky top-0 z-50 h-[72px] border-b border-rule bg-wash">
        <nav
          aria-label="Primary"
          className="shell flex h-full items-center justify-between gap-6"
        >
          <Link
            href="/"
            aria-label="PRESSMARK — home"
            className="font-display text-sub whitespace-nowrap"
            style={{ fontWeight: 800, letterSpacing: "-0.04em" }}
          >
            PRESSMARK
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="nav-link text-small font-medium">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <IconButton label="Search">
              <IconSearch />
            </IconButton>
            <IconButton label="Your account" href="/account">
              <IconAccount />
            </IconButton>
            <BasketLink />

            <Button size="sm" className="ml-3 hidden sm:inline-flex">
              Get a price
            </Button>

            {/* Native disclosure — no JS needed for the mobile menu. */}
            <details className="relative lg:hidden">
              <summary
                aria-label="Menu"
                className="flex size-8 cursor-pointer list-none items-center justify-center [&::-webkit-details-marker]:hidden"
              >
                <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true">
                  <path
                    d="M0 1h18M0 7h18M0 13h18"
                    stroke="currentColor"
                    strokeWidth="1.25"
                  />
                </svg>
              </summary>
              <ul className="absolute right-0 z-50 mt-4 w-[220px] border border-rule bg-paper">
                {LINKS.map((l) => (
                  <li
                    key={l.label}
                    className="border-b border-rule last:border-b-0"
                  >
                    <a href={l.href} className="block px-4 py-3 text-small">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </nav>
      </header>
    </>
  );
}
