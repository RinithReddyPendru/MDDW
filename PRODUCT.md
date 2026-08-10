# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: ASHAs** (Accredited Social Health Activists) — frontline community
health workers in Telugu-speaking rural India. They meet the app in two
distinct situations, and it must serve both:

1. **Facilitated** — first exposure in a trainer-led session at a PHC or
   training hall, where someone can unblock them.
2. **Unsupported** — returning alone on their own phone to practice, with no
   one to ask when something is unclear.

**Secondary: trainers and program staff** who run sessions and review results
(the `/admin` route and the Google Sheet behind it).

## Product Purpose

Teach and drill **MDD-W (Minimum Dietary Diversity for Women)** — the 10 food
groups and the "at least 5 groups in 24 hours" threshold — through interactive
play instead of lecture.

Success is behavioral, not score-based: an ASHA can identify food groups in a
real local meal, and can run a 24-hour dietary recall with a mother without
missing groups the mother failed to mention.

## Positioning

Most nutrition training tests *recall of the 10 groups*. This drills the
**counseling interview itself** — the Counseling Practice mode simulates a
mother who under-reports, so the ASHA must probe ("Did you have tea with
milk?") to uncover groups. That, plus food content drawn from actual Andhra
cuisine rather than generic textbook examples, is what a neighboring product
could not truthfully copy.

## Operating Context

- Flow: `/login` → `/learn` → `/game` → `/plate` → `/meals` → `/progress`,
  with `/admin` for staff.
- Three game modes, gated as three unlockable "levels" at a 60-point threshold:
  **Standard MCQ** (10 questions), **Counseling Practice** (5 simulated mother
  interviews), **Real-Life Meals** (5 visual plate identifications).
- Five badges: food_beginner, nutrition_learner, nutrition_champion,
  mddw_expert, asha_master.
- Mid-round resume, so a session interrupted by real work can be picked up.
- A generated certificate carrying the ASHA's name is the completion artifact.

## Capabilities and Constraints

**Stack (existing, not up for decision):** React 19 + TypeScript, Vite,
TanStack Router/Start, Tailwind v4 (CSS-first `@theme inline` tokens in
`src/styles.css`), shadcn/ui, framer-motion, deployed on Vercel.

**Languages — all three binding at full parity:** `te` (default), `en`, `hi`.
`t()` falls back `lang → en → raw key` (`translations.ts:1552`), so a missing
key silently shows English rather than failing loudly.

**Devices:** phone through tablet and desktop. The split-screen desktop layouts
in `login.tsx` and `index.tsx` are in genuine use and must not be treated as
scaffold leftovers.

**Progress is localStorage-only** (`mddw_progress_v1`). No accounts, no server
state. Clearing browser data loses everything, including an unfinished round.

**Known open issues that future work must not paper over:**

- **86 translation keys missing in both `hi` and `te`** — almost entirely the
  `ing_*` ingredient keys for the 40 Andhra dishes. Because Telugu is the
  default, Telugu users currently read English ingredient names.
- **48 keys are raw English sentences used as key names** (the counseling chat
  dialogue), which makes them unlocalizable in practice.
- **Results POST to a hardcoded Google Apps Script webhook**
  (`storage.ts:52`) using `mode: 'no-cors'`, so failures are invisible. The URL
  is committed to a public repository. It carries ASHA **names, WhatsApp
  numbers, and PHC/village**. *Unresolved: whether this endpoint is
  organizationally sanctioned and whether consent is captured.*
- **`src/routes/game.tsx` is 926 lines** holding five components; it is a third
  of the app's route code in one file.
- **"Levels" and "modes" are conflated** — three modes are presented as three
  sequential levels, which the copy does not consistently reflect.

## Brand Commitments

Name in use: **"MDD-W Master Challenge"**, subtitled "ASHA Training Program".
Display font `Baloo 2`, body `Noto Sans`, both paired with `Noto Sans Telugu`.
Theme color `#D97000`.

**A real sponsoring organization exists — details pending from the user.**
Until supplied, no organization name, logo, endorsement, or official standing
may be implied anywhere in the UI or on the certificate.

## Evidence on Hand

Real, usable content already in the repo:

- 40 Andhra-cuisine dishes with ingredient-to-food-group mappings
  (`mealsData.ts`).
- 10 food groups with localized names, examples and benefits
  (`foodGroups.ts`).
- Scripted counseling scenarios with probe branches (`probingScenarios.ts`,
  `scenarios.ts`).
- Dish and hero imagery in `public/`; MP3 voiceovers generated via
  `google-tts-api`.

**Absent — must not be fabricated:** testimonials, efficacy or outcome data,
partner or government logos, participant counts, and any claim of official
certification.

## Product Principles

1. **The unsupported ASHA sets the bar.** If something needs a trainer standing
   beside her to make sense, it is broken.
2. **Telugu is the product, not a translation.** English is the fallback path,
   never the reference experience.
3. **Local food, always.** Examples come from what an Andhra household actually
   eats; generic textbook foods break trust with both ASHA and mother.
4. **Teach the probe, not the list.** Value lives in uncovering what a mother
   did not think to mention.
5. **Never imply an authority the project does not hold.** No official framing
   until the sponsoring organization is confirmed in writing.

## Accessibility & Inclusion

- Telugu and Devanagari script must render correctly at every size; no
  clipping, no fallback-font substitution, no truncation of long Telugu labels.
- Targets sized for real use: outdoors, one-handed, in a hurry, on a phone that
  may be someone else's.
- Text must stay legible in daylight — contrast is a field requirement, not a
  compliance checkbox.
- Never rely on color alone to convey a food group; the 10 group colors need a
  second channel (label, emoji, or icon).
