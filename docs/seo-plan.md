
# SEO Audit & Improvement Plan — staketforetagscenter.se

Source: Semrush (database `se`), live HTML fetch of the homepage, robots/sitemap probe. Note: this site is a separate live PHP site (Laravel-style `csrf-token`, `PHP/8.0.30`, Bootstrap/owl-carousel template) — not the Lovable project in this workspace. The plan below is implementation guidance for whoever maintains that site.

---

## 1. Current state (the honest snapshot)

**Visibility (Semrush, se):**
- Authority Score: **2/100**, Trust Score: **2/100**
- Organic keywords: **23**, estimated organic traffic: **~0/mo**
- Backlinks: 46 from 31 referring domains — **43 of 46 are nofollow**, top referrers are spam TLDs (`wants.cfd`, `blinks.monster`, `knows.monster`, `seodomains.website`). Effectively zero real link equity.
- 5-year trend: flat near zero. The site has never built meaningful organic presence.
- The only keywords ranking are **accidental address queries** ("skarprättarvägen 7", "girovägen 11", "företag järfälla") because the `/foretag` page lists tenant addresses. Zero rankings for any commercial term like "hyra lokal järfälla", "kontorshotell stockholm", "lokal uthyrning kungsängen".

**On-page (homepage):**
- `<title>Stäket Företagscenter</title>` — brand only, no keyword, no location, no value prop
- `<meta name="description" content="">` — **empty**
- **4 `<h1>` tags** on one page (slider abuse)
- All `<img alt="image description">` — placeholder alt on every image
- No Open Graph / Twitter card tags
- No `<link rel="canonical">`, no `hreflang="sv"` declared on `<html>` properly
- No JSON-LD structured data (no `LocalBusiness`, `Organization`, `Place`, `RealEstateListing`)
- Template is a 2014-era Bootstrap/owl-carousel build with IE7/8 conditional comments — not mobile-first, slow LCP, no lazy loading

**Technical:**
- `robots.txt`: **missing (empty body)**
- `sitemap.xml`: **404 Not Found**
- Server: Apache + PHP 8.0.30 (EOL — PHP 8.0 lost security support Nov 2023)
- Images served full-size from `/public/images/` — no WebP/AVIF, no `srcset`
- 10+ separate render-blocking CSS files

**Content:**
- Homepage is ~150 words of generic text, mostly slider captions
- Site has **2 indexed pages of substance**: `/omoss` and `/foretag`
- No service pages, no location pages, no pages for individual tenant companies, no blog, no case studies
- Site name is "Stäket Företagscenter" (a business park in the Stäket area of Järfälla, north-west Stockholm) but the page never explains *what it is, who it's for, what you can rent, or how to contact*

**Competitor landscape (Semrush organic competitors, .se):**
Semrush surfaces low-relevance neighbors (`brfskarp.se`, `verkstadslokaler.se`, local auto shops) — meaning the site has no clear category. Real commercial competitors in the Stockholm "business center / kontorshotell / verkstadslokaler" space — `verkstadslokaler.se` (462 kw, ~253 visits), `objektvision.se` (45k kw, 188k visits), `kontorshotell.com`, `regus.com/sv-se`, `mindspace.me`, `workaround.se`, local players in Järfälla/Kungsängen — own this space.

---

## 2. Verdict against the four lenses

| Lens | Score | Why |
|---|---|---|
| **SEO** (classic) | 1/10 | Empty meta, no sitemap/robots, no schema, no content, AS 2 |
| **AEO** (Answer Engine / featured-snippet / SGE) | 0/10 | No FAQ blocks, no Q&A copy, no concise answers, no schema — nothing for Google AI Overviews / ChatGPT / Perplexity to quote |
| **GEO** (Generative Engine Optimization & local geo) | 1/10 | Address visible only as plain text; no `LocalBusiness` schema, no Google Business Profile signals on-site, no "Järfälla / Stockholm / Stäket / Kungsängen" keyword targeting, no embedded map |
| **EEAT** (Experience, Expertise, Authoritativeness, Trust) | 1/10 | No author/owner info, no team page, no org number, no reviews, no case studies, no HTTPS-padlock issues but no privacy policy / GDPR notice visible, toxic backlink profile drags Trust to 2/100 |

---

## 3. Improvement roadmap

Ordered by impact ÷ effort.

### Phase 0 — Stop the bleeding (Week 1, must-fix)
1. **Set a real `<title>`** per page. Homepage: `Stäket Företagscenter — Lokaler & företag i Järfälla, Stockholm` (≤60 chars).
2. **Write `<meta name="description">`** per page (≤155 chars), unique, with primary keyword + location + call-to-action.
3. **Publish `/robots.txt`** allowing crawl and pointing to `Sitemap: https://staketforetagscenter.se/sitemap.xml`.
4. **Generate `/sitemap.xml`** with every public URL (`/`, `/omoss`, `/foretag`, plus future pages from Phase 2).
5. **Fix `<h1>` abuse** — exactly one `<h1>` per page. Slider captions become `<h2>` or styled `<div>`.
6. **Replace all `alt="image description"`** with descriptive Swedish alt text ("Fasad Stäket Företagscenter Järfälla", etc.).
7. **Add Open Graph + Twitter cards** (`og:title`, `og:description`, `og:image`, `og:url`, `og:type=website`, `twitter:card=summary_large_image`).
8. **Add `<link rel="canonical">`** self-referencing each URL.
9. **Disavow the spam backlinks** (`wants.cfd`, `blinks.monster`, `knows.monster`, `seodomains.website`, `*.icu`, `*.cfd`, `*.sbs`, `*.monster`) via Google Search Console disavow file. They actively hurt Trust Score.
10. **Verify in Google Search Console + Bing Webmaster Tools** and submit the new sitemap.

### Phase 1 — Local + structured data (Weeks 2–3)
1. **`LocalBusiness` JSON-LD** on homepage with name, address (Skarprättarvägen 7?, Järfälla), geo coordinates, opening hours, phone, email, sameAs (Facebook, LinkedIn, Google Business Profile URL).
2. **Create / claim Google Business Profile** for "Stäket Företagscenter" — Järfälla, category "Affärscenter" / "Lokaluthyrning". Add 10+ photos, hours, services. This is the single highest-leverage GEO move.
3. **Embed Google Map** on `/omoss` and a new `/kontakt` page.
4. **Add NAP (Name/Address/Phone) block** identical on every page footer — must match GBP exactly.
5. **`Organization` + `WebSite` JSON-LD** sitewide in `<head>`.
6. **Per-tenant `Organization` schema** on `/foretag` listings (each company gets name, url, telephone, address).

### Phase 2 — Content architecture (Weeks 3–6)
Build the pages that actually rank. Target keywords with real local intent:

| New URL | Target keyword | Volume (se) | KDI |
|---|---|---|---|
| `/lokaler-att-hyra` | "hyra lokal järfälla" | 170 | 15 (easy) |
| `/lediga-lokaler-jarfalla` | "lediga lokaler i järfälla" | 90 | low |
| `/kontorshotell-jarfalla` | "kontorshotell järfälla" | low but commercial | low |
| `/verkstadslokal-stockholm` | "verkstadslokal stockholm" | medium | medium |
| `/foretag/[slug]` | one page per tenant company | long-tail brand searches | very easy |
| `/omradet-staket-jarfalla` | "stäket järfälla" + neighborhood info | local | low |
| `/blogg/...` | service guides (e.g. "Så hittar du rätt verkstadslokal i Stockholm") | long-tail | low |

Each new page: unique title + meta, 600–1200 words, one `<h1>`, semantic `<h2>`/`<h3>`, internal links, image + schema, FAQ block at bottom (see AEO).

### Phase 3 — AEO (Answer Engine Optimization) (Weeks 4–6, parallel)
1. **Add `FAQPage` JSON-LD** + visible FAQ to every commercial page. Questions = real searcher phrasing:
   - "Vad kostar det att hyra lokal i Järfälla?"
   - "Hur stora lokaler finns på Stäket Företagscenter?"
   - "Vilka företag finns på Stäket Företagscenter?"
   - "Hur tar jag mig till Stäket Företagscenter?"
2. **Write in concise answer-first paragraphs** — the first sentence after every `<h2>` should be a 30–50-word direct answer (AI Overviews / Perplexity quote those).
3. **Use definition lists and tables** for facts (sizes, prices, amenities) — LLMs prefer structured data.
4. **Add `BreadcrumbList` JSON-LD** sitewide.

### Phase 4 — EEAT (Weeks 5–8)
1. **`/om-oss` rebuild**: real story, founding year, owner names + photo + LinkedIn, org-nummer, F-skatt status, certifications.
2. **`/kontakt`** with named contact person, photo, direct phone, response-time promise.
3. **Tenant testimonials / case studies** — even 3 short quotes from current companies on site.
4. **Privacy policy + cookie banner** (GDPR compliance is an EEAT trust signal in `.se`).
5. **HTTPS-only**, HSTS header, fix any mixed-content.
6. **Link building (replace spam with real)**:
   - Local: Järfälla kommun näringslivsregister, Stockholm Business Region, Företagarna, branch directories (`hitta.se`, `eniro.se`, `merinfo.se`, `allabolag.se`)
   - Per-tenant: every tenant company should link from their own site to your `/foretag/[their-slug]` page
   - PR: 1–2 local press mentions (Mitt i Järfälla, Vi i Järfälla)

### Phase 5 — Technical & performance (Weeks 4–8, parallel)
1. **Upgrade PHP** 8.0.30 → 8.3 (security + ~10% speed).
2. **Replace owl-carousel + jQuery + 10 CSS files** with a modern build (Tailwind or a single bundled CSS; native CSS scroll-snap for the slider). Drop IE7/8 conditional comments.
3. **Image pipeline**: convert all `/public/images/*.jpg` to WebP, generate `srcset` for 480/960/1920, add `loading="lazy"` to below-fold images and `fetchpriority="high"` to LCP image.
4. **Core Web Vitals target**: LCP < 2.5s, INP < 200ms, CLS < 0.1. Measure with PageSpeed Insights + CrUX.
5. **Add `<html lang="sv">`** correctly (currently has it but inside an old conditional block).
6. **HTTP caching headers** (`Cache-Control: public, max-age=31536000, immutable`) on `/public/*` assets.
7. **Brotli compression** on Apache (`mod_brotli`).
8. **Security headers**: `Strict-Transport-Security`, `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.

### Phase 6 — Measurement & iteration (ongoing)
- Set up **Google Search Console**, **Bing Webmaster Tools**, **GA4** (or Plausible/Umami if privacy-first).
- Track: impressions, clicks, average position, CTR, indexed pages, Core Web Vitals.
- Re-audit monthly. Realistic timeline: meaningful keyword movement at 3 months, traffic compounding at 6–12 months.

---

## 4. URL-naming conventions going forward

Current `/foretag`, `/omoss` are fine — short, Swedish, no IDs. Apply the same pattern to new pages:

- ✅ `/lokaler-att-hyra`, `/foretag/exempel-ab`, `/blogg/hyra-verkstadslokal-stockholm`
- ❌ `/?p=42`, `/page-1`, `/companies?id=7`, mixed `omoss` vs `om-oss` (pick one — recommend `/om-oss` with hyphen for readability; 301-redirect old `/omoss`)

Rules: lowercase, hyphen-separated, Swedish words (ä/ö ok but ASCII-equivalent preferred for share-ability: `staket` not `stäket`), no trailing slash inconsistency, no `.php` extension exposed.

---

## 5. Expected outcome

Phase 0+1 alone typically lifts a site like this from AS 2 → AS 8–12 within 60 days (real backlinks + clean structure). Phase 2+3 should land top-10 rankings for "hyra lokal järfälla" (KDI 15) and 5–10 long-tail tenant-name queries within 3–6 months. Realistic 12-month organic traffic target: **400–800 sessions/month** (vs. ~0 today). The ceiling is set by the size of the local market — this is a regional business center, not a national e-commerce play.

---

## 6. What this plan does *not* include

- Paid search (Google Ads) — separate plan if interested
- Social media strategy
- Email/newsletter
- Conversion-rate optimization beyond on-page basics
- A full rebuild of the site on a modern stack (worth discussing — the current Laravel + 2014 template is the bottleneck for half the technical items)

**Want me to:** (a) go deeper on any single phase, (b) draft the actual `<title>`/`<meta>`/JSON-LD snippets ready to paste in, (c) pull a keyword-gap export vs. specific competitors you name, or (d) rebuild this site fresh on the modern Lovable stack with all the above baked in?
