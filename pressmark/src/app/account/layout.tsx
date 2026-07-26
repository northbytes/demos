import Link from "next/link";
import { AccountShell } from "@/components/site/account-shell";
import { SiteFooter, SiteNav } from "@/components/site/site-nav";
import { DETAILS } from "@/lib/account";

/* One shell for all six sections — the rail, the owner's header and the
 * breadcrumb are the same on every one, so they live here and each section
 * renders only itself. */

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteNav />

      <main className="flex-1">
        <nav aria-label="Breadcrumb" className="border-b border-rule bg-wash">
          <ol className="shell flex h-[48px] items-center gap-3">
            <li className="flex items-center gap-3">
              <Link href="/" className="t-utility opacity-60 hover:opacity-100">
                PRESSMARK
              </Link>
              <span aria-hidden="true" className="t-utility opacity-30">
                /
              </span>
            </li>
            <li className="t-utility" aria-current="page">
              YOUR ACCOUNT
            </li>
          </ol>
        </nav>

        <div className="shell py-12 md:py-18">
          <header className="border-b border-rule pb-8">
            <span className="t-utility opacity-55">SIGNED IN</span>
            <h1 className="t-section mt-4">Your account</h1>
            <p className="t-note mt-4 opacity-60">
              {DETAILS.name.toUpperCase()} · {DETAILS.role.toUpperCase()} ·
              ACCOUNT {DETAILS.account}
            </p>
          </header>

          <div className="mt-12">
            <AccountShell>{children}</AccountShell>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
