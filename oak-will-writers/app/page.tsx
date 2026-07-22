import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { TrustBar } from "@/components/trust-bar"
import { Reassurance } from "@/components/reassurance"
import { AboutSteve } from "@/components/about-steve"
import { Services } from "@/components/services"
import { Society } from "@/components/society"
import { Process } from "@/components/process"
import { Areas } from "@/components/areas"
import { Contact } from "@/components/contact"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <main id="top" className="bg-background">
      <SiteHeader />
      <Hero />
      <TrustBar />
      <Reassurance />
      <AboutSteve />
      <Services />
      <Society />
      <Process />
      <Areas />
      <Contact />
      <SiteFooter />
    </main>
  )
}
