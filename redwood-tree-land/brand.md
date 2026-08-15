# Redwood Tree & Land Services — Brand & Content Pack

> Demo site built for a **real prospect**. Unlike most demos in this repo, the
> content here is **not invented** — at Lucas's instruction every detail was
> lifted from the live site at <https://redwoodtreeandland.co.uk/> on
> **15 August 2026**: real trading name, real phone numbers, real email, real
> address, real accreditations, real service list, real testimonials.
>
> That means: **do not treat this file as placeholder copy.** If a detail is
> here, it is because Redwood publish it themselves. Anything Redwood do not
> publish (prices, team names, response-time promises, job counts) is
> **deliberately absent** and must not be invented — the whole point of this
> build is that Redwood can read it and recognise themselves.

---

## 1. The business, from their own site

| Field | Value |
| :--- | :--- |
| Trading name | **Redwood Tree and Land Services** (logo styles it `RedWood`) |
| What they are | Professional arboriculture contractors |
| Based | Rayleigh, Essex |
| Address | Runwell Hall Farm, Hoe Lane, Rettendon, CM3 8DQ |
| Mobile | 07500 778684 |
| Landline | 01268 422777 |
| Email | info@redwoodtreeandland.co.uk |
| Facebook | <https://www.facebook.com/redwoodessex/> |
| Named principal | **Kurt** (named in two of their three testimonials) |
| Copyright line | "Copyright 2020 Redwood Tree and Land Services" |

**Areas covered:** Essex, Brentwood and the surrounding counties. Their own
footer links three local landing pages — Rayleigh, Brentwood, Essex — of which
**Brentwood 404s on the live site** (a real, findable defect worth mentioning
in the pitch).

### Accreditations they display

City & Guilds · NPTC · **LANTRA Awards Approved** · **ARB Approved Contractor**
(trees.org.uk) · **Checkatrade.com**

They also state: *"Redwood Tree & Land Services hold full public liability
insurance and all work is guaranteed."*

This is the single most under-sold asset on the live site. ARB Approved
Contractor is a genuinely hard accreditation to hold — it involves an audit of
work quality, staff competence, and business practice — and on the current site
it is a small grey logo halfway down the homepage. On the demo it sits in the
hero.

---

## 2. Services — exactly as they list them

**Tree services**

- Tree Surgery
- Site Clearance
- Stump Grinding
- Tree Planting
- Vegetation Management
- Tree Surveys
- TPO Applications
- Emergency call outs
- Free Quotations

**Additional / land-based services**

- Land-Based Services
- Turfing
- Garden Clearance

Their own framing: *"From minor pruning to complete tree removal and felling"*
and *"We also carry out soft landscaping works, including turf laying, garden
clearance and maintenance."*

---

## 3. Copy that is genuinely theirs (quote it, don't rewrite it)

**Site tagline (their `<title>`):**
> We provide complete tree surgeon and soft landscape services to customers in
> Essex and the surrounding counties

**Homepage lead:**
> Based in Rayleigh, we are a professional arboriculture contractors providing
> complete tree and land-based services to customers in Essex, Brentwood and the
> surrounding counties.

**The safety line — their strongest single sentence, buried on the live site:**
> All our tradesmen are fully trained with many years' experience. Health and
> Safety are highly important to us, and we will never begin work on a tree
> without first carrying out a site survey to ensure safety to both our staff
> and the public.

**The consultation line:**
> For any work we are involved in, we always take care to have a thorough
> discussion with our customers, to ensure we understand their exact
> requirements. This allows us to carry out the work they specify efficiently
> and effectively.

---

## 4. Testimonials — all three are real, verbatim from their homepage

1. **"Can't recommend Redwood enough."**
   *"Kurt and his guys provided a top service, friendly team and hard working.
   Absolute pleasure and thanks again for the great job you've done today."*
   — A. Bridgey

2. **"Kurt and his team were excellent"**
   *"Communicated well throughout and really went out of their way to help us
   meet a deadline. Will recommend them to all our friends and family."*

3. **"100% recommended!"**
   *"They came, they sawed, they conkerd, terrible puns, I know, very pleased
   with their professionalism and their attention to detail and safety. Will be
   happy to work with these guys again"*

Only #1 carries an attribution on the live site; #2 and #3 are unattributed
there, so they stay unattributed here. Reviews are sourced from their Facebook
page.

---

## 5. Positioning for the redesign

The live site says *what* they do and never says *why it should be them*. Three
things are sitting right there in their own copy, unused:

1. **ARB Approved + LANTRA + NPTC + insured + guaranteed.** Most Essex tree
   firms are two lads and a chipper. Redwood are audited. Lead with it.
2. **"We will never begin work on a tree without first carrying out a site
   survey."** That is the whole trust proposition in one sentence, and it is
   currently truncated with an ellipsis behind a MORE button.
3. **Tree work *and* land services.** They fell the tree, grind the stump, clear
   the site, re-fence, re-turf and plant. The customer's garden goes from
   liability to finished — one firm, one visit. **This is what the scroll video
   dramatises**, and it is the reason the video is the spine of the homepage
   rather than decoration.

**Hero line used on the demo:**
> Take the tree down. Leave the garden better.

**Supporting line:**
> ARB Approved arboriculture contractors in Rayleigh, covering Essex, Brentwood
> and the surrounding counties. Fully insured, every job guaranteed — and we
> never start work on a tree without surveying it first.

---

## 6. Visual identity

**Their mark:** a red conifer inside a red brush-drawn circle, wordmark
`RedWood` in a heavy slab-ish serif with `TREE & LAND SERVICES` letterspaced
beneath. Supplied file is only 323×104px, so the demo redraws the mark as inline
SVG to stay crisp.

**Brand red — `#EE0C19`**, taken from their own stylesheet (`.navbar-nav
li a:hover { color: #ee0c19 }`), not eyeballed from the logo.

**Palette used on the demo** (red kept as a pure accent — at full-bleed it
fights the green of the video):

| Token | Hex | Use |
| :--- | :--- | :--- |
| Heartwood | `#0C120E` | page ground, near-black with a green cast |
| Bark | `#161F18` | raised surfaces, cards |
| Redwood | `#EE0C19` | CTAs, rules, the mark — accent only |
| Redwood deep | `#B00610` | accent text on light, hover |
| Sapwood | `#F2EFE8` | primary text on dark, light sections |
| Moss | `#7E9A6E` | secondary/meta text, quiet UI |
| Timber | `#C9955F` | rare warm tint (log store, cut ends) |

**Type:** Fraunces (display, an optical serif with real weight — reads as
"established trade", not "startup") over Inter (body). The live site uses
Montserrat/Roboto/Open Sans defaults, which is exactly why it looks like a
template.

---

## 7. Hard rules for anyone editing this demo

- **Invent nothing.** No made-up prices, no "500+ trees felled", no fake staff
  photos, no invented response times. If Redwood don't say it, the demo doesn't
  say it.
- **The forms are inert.** They validate and return a demo notice. Nothing is
  sent anywhere.
- **Photography is AI-generated**, not scraped from their gallery — their job
  photos are their copyright. The logo and accreditation marks are theirs and
  are used as-is, which is normal for a pitch mockup.
- The demo is `"hidden": true` so it stays off the public /demos grid until
  Redwood have seen it. That is not security — the direct link still works,
  which is the point.
