/**
 * Appearance styles ("Style wyglądu") — the ONE table every style lives in (decisions D63–D67,
 * `rejestr-decyzji.md`; `docs/lista-do-zrobienia.md`, entry „Tryb wyglądu Premium”). A style is a
 * set of token values plus a few component variants, not a rewrite of screens
 * (`docs/opis-ekranow-dla-ai.md`, section 8). The CSS for every style is generated from this table
 * (`generujCssStylow`, injected by `app/layout.tsx`) — nothing is hand-written per style in
 * `app/globals.css`, so adding a style is one entry here plus its names in `lib/i18n/ui/wyglad.ts`.
 *
 * Source of the colours: the owner-approved prototype https://claude.ai/artifact/JsYnhZYECTQtSTAPAj4kmL
 * (live preview `.dev` tokens for styles 1–3, boards `.bp.n1`–`.bp.n25` for the others; the light
 * boards define only 🟢, so light styles take the light verdict set and dark styles the dark one).
 * Deviations from the prototype are deliberate and listed at each value: almost all of them come
 * from the WCAG contrast test (`__tests__/style.test.ts`) failing on the prototype value; the rest
 * are prototype features with no single testable colour (gradient text) or no source in the app
 * (house photos, D61), also noted at the value.
 *
 * Layering (documented in `docs/memory.md`): built-in defaults in `globals.css` (light/dark/system)
 * < the chosen style (`html:root[data-styl=…]`, which also fixes the light/dark scheme) < the user's
 * per-colour overrides from `./storage.ts` (inline style on `<html>`, so they always win).
 *
 * Verdict colours are sacred (`docs/opis-ekranow-dla-ai.md`, section 7): a style may only darken or
 * lighten 🟢/🟡/🔴 within their own hue to reach contrast — never recolour them to gold, grey or the
 * accent.
 */

import { jestHeksem, zmieszaj } from "./kolor"

export type GrupaStylu = "premium" | "jasne" | "eksperymentalne" | "ukryte"

/** Groups in display order (D67). `ukryte` is shown only after the toggle in the settings. */
export const GRUPY_STYLOW: readonly { id: GrupaStylu; nazwaKlucz: string }[] = [
  { id: "premium", nazwaKlucz: "UI-WYGLAD-GRUPA-PREMIUM" },
  { id: "jasne", nazwaKlucz: "UI-WYGLAD-GRUPA-JASNE" },
  { id: "eksperymentalne", nazwaKlucz: "UI-WYGLAD-GRUPA-EKSPERYMENTALNE" },
  { id: "ukryte", nazwaKlucz: "UI-WYGLAD-GRUPA-UKRYTE" },
]

/**
 * Availability (D67 addendum): styles 1–3 are the base styles of the paid PRO version; the rest is
 * undecided until the freemium decision (standard ch. 12). Informational only — nothing is locked
 * until freemium is implemented, every style is available to everyone.
 */
export type DostepnoscStylu = "pro" | "nieustalona"

/** The light/dark scheme a style forces on `<html>` (the theme toggle applies to the default look only). */
export type SchematStylu = "jasny" | "ciemny"

export type TokenyStylu = {
  /** Page background → `--background`. */
  tlo: string
  /** Cards, popovers → `--card`, `--popover`, `--sidebar`. */
  karta: string
  /** Second surface (inputs, muted blocks, hover) → `--secondary`, `--muted`, `--accent`. */
  karta2: string
  /** Text on background and cards. */
  tekst: string
  /** Secondary text → `--muted-foreground`. */
  tekstPrzygaszony: string
  /** Accent: buttons, active states, focus ring → `--primary`, `--ring`. */
  akcent: string
  /** Text on the accent → `--primary-foreground`. */
  akcentTekst: string
  /** Borders of fields and outline buttons → `--border`, `--input` (WCAG 1.4.11: ≥ 3:1). */
  obrys: string
  /**
   * Focus ring → `--ring`, when it must not be the accent (Pomarańcz sygnałowy, D65: orange only on
   * edges, buttons and navigation, neutral ring). Default: `akcent`. ≥ 3:1 on page and card.
   */
  pierscien?: string
}

export type WerdyktyStylu = {
  /** Base colour of 🟢 — border, icon, badge (non-text: ≥ 3:1). */
  ok: string
  /** Text of 🟢 (≥ 4.5:1). */
  okTekst: string
  uwaga: string
  uwagaTekst: string
  blad: string
  bladTekst: string
  /** Share of the base colour in the verdict box background, mixed over `karta` (0–0.3). */
  udzialTla: number
}

export type WariantyStylu = {
  /** Headings h1–h3. "odreczne" = Caveat (has Cyrillic), Notatnik inżyniera only (D67). */
  naglowki: "szeryf" | "bezszeryf" | "mono" | "odreczne"
  /** Numbers in tables and lists (`tabular-nums`). Never handwritten (D67: tables and forms in Inter). */
  liczby: "szeryf" | "mono" | "bezszeryf"
  /** Corner radius, rem → `--radius`. */
  promien: number
  /**
   * The big result number (`.wynik-glowny`, `components/wzorce/wynik-glowny.tsx`), when a style
   * changes it: font → `--font-wynik`, colour → `--kolor-wyniku` (Terminal DOS, D67: white, never
   * the 🟡 yellow — tested ≥ 4.5:1 on every verdict box). Without it the result looks as before.
   */
  wynik?: { czcionka?: "odreczne" | "mono"; kolor?: string }
  /** Body text font → `--font-tekst` (Terminal DOS: monospace everywhere; wins over the user's font pick). */
  tekst?: "mono"
}

/**
 * Decorations beyond tokens (experimental styles, D66/D67). Generated into CSS like the tokens, with
 * the conditions of D66/D67 built into the generator, not left to each entry:
 * - card effects go only to `SELEKTOR_KARTY` (cards that opt in), never to verdict or warning boxes;
 * - every animation sits inside `@media (prefers-reduced-motion: no-preference)`;
 * - the moving background (`tloRuchome`) runs only on the dashboard (`[data-pulpit]`, `app/page.tsx`);
 * - glass blur has an opaque fallback: no `backdrop-filter` support, `prefers-reduced-transparency`,
 *   or a weak device (`data-bez-rozmycia` on `<html>`, set by the pre-hydration script in the layout).
 */
export type EfektyStylu = {
  /**
   * Static page decoration (CSS background layers on `<body>`, fixed to the viewport). `kolory` =
   * every opaque colour the decoration fills an area with (gradient stops, glows, already blended
   * over `tlo`): the contrast test checks text, borders, accent and verdicts on each of them.
   * Hairlines and points (grid lines ≤ 1 px, stars) are not areas and are not listed.
   */
  tlo?: { obraz: string; kolory: readonly string[] }
  /** Moving page background (Płynny gradient): `obraz` layers sized 150 % and slid between two positions. */
  tloRuchome?: { obraz: string; kolory: readonly string[]; od: string; do: string; sekundy: number }
  karta?: {
    /** `box-shadow` (Neumorfizm, Brutalizm). */
    cien?: string
    /** A 3 px left edge in the accent (Pomarańcz sygnałowy: orange on edges, D65). */
    krawedzAkcentu?: boolean
    /** Rainbow frame (Holograficzny); slides slowly unless reduced motion is requested. */
    teczowa?: { kolory: readonly string[]; sekundy: number }
    /** Frosted glass: `kolor` at `krycie` over the page, blurred by `rozmycie` px; fallback = opaque `karta`. */
    szklo?: { kolor: string; krycie: number; rozmycie: number }
  }
}

export type StylWygladu = {
  id: string
  nazwaKlucz: string
  opisKlucz: string
  grupa: GrupaStylu
  dostepnosc: DostepnoscStylu
  schemat: SchematStylu
  tokeny: TokenyStylu
  werdykty: WerdyktyStylu
  warianty: WariantyStylu
  efekty?: EfektyStylu
}

/**
 * Cards that take a style's card effects: `bg-card` surfaces and elements marked `data-karta`
 * (dashboard tiles). Boxes with `role="status"`/`role="alert"` — `WerdyktPanel`, `StanBledu`,
 * `StanPusty` — are excluded by the selector itself, so no effect (rainbow, neon, glass) can ever
 * land on a verdict or warning card (D66).
 */
export const SELEKTOR_KARTY = ':is(.bg-card,[data-karta]):not([role="status"],[role="alert"])'

/** Prototype verdict set for dark styles (`.dev`: --ok/--warn/--err and their -t text shades). */
const WERDYKTY_CIEMNE: WerdyktyStylu = {
  ok: "#22C55E",
  okTekst: "#4ADE80",
  uwaga: "#F59E0B",
  uwagaTekst: "#FBBF24",
  blad: "#EF4444",
  bladTekst: "#F87171",
  udzialTla: 0.12,
}

/**
 * Light styles on warm/white paper. Prototype light set (#16A34A/#D97706/#DC2626, text
 * #15803D/#A15C07/#B91C1C) failed the test on the cream background of „Jasny architektoniczny”
 * (🟢 text 4.31:1, 🟢/🟡 borders 2.8:1) — same hues, one step darker (700 base / 800 text).
 */
const WERDYKTY_JASNE: WerdyktyStylu = {
  ok: "#15803D",
  okTekst: "#166534",
  uwaga: "#B45309",
  uwagaTekst: "#92400E",
  blad: "#B91C1C",
  bladTekst: "#991B1B",
  udzialTla: 0.1,
}

/**
 * Rozdzielnica sits on mid-grey RAL 7035 (#C9CEC9) — even the darker light set leaves text at
 * ~4.4:1 there, so text goes one more step down (900); borders stay 700 (≥ 3:1).
 */
const WERDYKTY_ROZDZIELNICA: WerdyktyStylu = {
  ...WERDYKTY_JASNE,
  okTekst: "#14532D",
  uwagaTekst: "#78350F",
  bladTekst: "#7F1D1D",
}

/**
 * Pomarańcz sygnałowy (D65: accent very close to 🟡). With the prototype set, the orange accent
 * #FF6B1A and 🟡 #F59E0B are ΔE00 5.6 apart for deuteranopia — closer than 🟢 and 🔴 are to each
 * other (7.7), which fails the colour-vision test. 🟡 is lightened within its own hue (amber 500 →
 * 400, text 400 → 300), which moves it away from the orange for every vision type.
 */
const WERDYKTY_POMARANCZ: WerdyktyStylu = {
  ...WERDYKTY_CIEMNE,
  uwaga: "#FBBF24",
  uwagaTekst: "#FCD34D",
}

export const STYLE_WYGLADU = [
  {
    id: "grafit-zloto",
    nazwaKlucz: "UI-STYL-GRAFIT-ZLOTO",
    opisKlucz: "UI-STYL-GRAFIT-ZLOTO-OPIS",
    grupa: "premium",
    dostepnosc: "pro",
    schemat: "ciemny",
    tokeny: {
      tlo: "#08111B",
      karta: "#0F1C2D",
      karta2: "#14263D",
      tekst: "#FFFFFF",
      tekstPrzygaszony: "#AAB4C3",
      akcent: "#D4AF6A",
      akcentTekst: "#1A1406",
      // Prototype line rgba(255,255,255,.08) is decorative (≈1.2:1); field borders need ≥ 3:1.
      obrys: "#6C7787",
    },
    werdykty: WERDYKTY_CIEMNE,
    warianty: { naglowki: "szeryf", liczby: "szeryf", promien: 1 },
  },
  {
    id: "granat-miedz",
    nazwaKlucz: "UI-STYL-GRANAT-MIEDZ",
    opisKlucz: "UI-STYL-GRANAT-MIEDZ-OPIS",
    grupa: "premium",
    dostepnosc: "pro",
    schemat: "ciemny",
    tokeny: {
      tlo: "#0A1630",
      karta: "#11224A",
      karta2: "#172C5C",
      tekst: "#F4F7FD",
      tekstPrzygaszony: "#A8B5D2",
      akcent: "#D58A5A",
      akcentTekst: "#1D0E05",
      obrys: "#6C7A9C",
    },
    werdykty: WERDYKTY_CIEMNE,
    warianty: { naglowki: "szeryf", liczby: "szeryf", promien: 1 },
  },
  {
    id: "tytan",
    nazwaKlucz: "UI-STYL-TYTAN",
    opisKlucz: "UI-STYL-TYTAN-OPIS",
    grupa: "premium",
    dostepnosc: "nieustalona",
    schemat: "ciemny",
    tokeny: {
      tlo: "#0F1216",
      karta: "#151A20",
      karta2: "#1D242C",
      tekst: "#EEF1F4",
      tekstPrzygaszony: "#9AA3AE",
      akcent: "#CDD6E0",
      akcentTekst: "#0F1216",
      // Prototype platinum frame rgba(205,214,226,.5) over the card, as one hex.
      obrys: "#717880",
    },
    werdykty: WERDYKTY_CIEMNE,
    warianty: { naglowki: "szeryf", liczby: "szeryf", promien: 1 },
  },
  {
    id: "las-mosiadz",
    nazwaKlucz: "UI-STYL-LAS-MOSIADZ",
    opisKlucz: "UI-STYL-LAS-MOSIADZ-OPIS",
    grupa: "premium",
    dostepnosc: "nieustalona",
    schemat: "ciemny",
    tokeny: {
      tlo: "#0A1510",
      karta: "#0F1F18",
      karta2: "#153026",
      tekst: "#F1EEE3",
      tekstPrzygaszony: "#A8B5AA",
      akcent: "#C8A15A",
      akcentTekst: "#0A1510",
      // Prototype brass frame rgba(200,161,90,.58) over the card is #7A6A3E, 2.7:1 on the second
      // surface; lifted 6 % towards white.
      obrys: "#82734A",
    },
    // D64 auditor note („Las” has the weakest 🟢 on its background): the dark set passes as is.
    werdykty: WERDYKTY_CIEMNE,
    warianty: { naglowki: "szeryf", liczby: "szeryf", promien: 1 },
  },
  {
    id: "kreslarski",
    nazwaKlucz: "UI-STYL-KRESLARSKI",
    opisKlucz: "UI-STYL-KRESLARSKI-OPIS",
    grupa: "premium",
    dostepnosc: "nieustalona",
    schemat: "ciemny",
    tokeny: {
      tlo: "#0C1F3A",
      karta: "#0F2747",
      karta2: "#133159",
      tekst: "#EAF2FC",
      tekstPrzygaszony: "#A3B8D4",
      akcent: "#E4EEFA",
      akcentTekst: "#0C1F3A",
      // Prototype white frame rgba(214,230,250,.6) over the card.
      obrys: "#869AB2",
    },
    werdykty: WERDYKTY_CIEMNE,
    warianty: { naglowki: "szeryf", liczby: "szeryf", promien: 0.375 },
    efekty: {
      // Prototype drafting grid: 1 px lines rgba(170,200,240,.07) every 14 px (hairlines only).
      tlo: {
        obraz:
          "linear-gradient(rgba(170,200,240,.07) 1px,transparent 1px) 0 0/14px 14px,linear-gradient(90deg,rgba(170,200,240,.07) 1px,transparent 1px) 0 0/14px 14px",
        kolory: [],
      },
    },
  },
  {
    id: "noc-polarna",
    nazwaKlucz: "UI-STYL-NOC-POLARNA",
    opisKlucz: "UI-STYL-NOC-POLARNA-OPIS",
    grupa: "premium",
    dostepnosc: "nieustalona",
    schemat: "ciemny",
    tokeny: {
      tlo: "#070B16",
      karta: "#0C1323",
      karta2: "#111B31",
      tekst: "#EEF2FA",
      tekstPrzygaszony: "#9AA6BE",
      akcent: "#A9C8F0",
      akcentTekst: "#070B16",
      // Prototype ice frame rgba(160,195,240,.38) over the card is #445671, 2.3–2.6:1; lifted 11 % towards white.
      obrys: "#596981",
    },
    werdykty: WERDYKTY_CIEMNE,
    warianty: { naglowki: "szeryf", liczby: "szeryf", promien: 1 },
  },
  {
    id: "rozowe-zloto",
    nazwaKlucz: "UI-STYL-ROZOWE-ZLOTO",
    opisKlucz: "UI-STYL-ROZOWE-ZLOTO-OPIS",
    grupa: "premium",
    dostepnosc: "nieustalona",
    schemat: "ciemny",
    tokeny: {
      tlo: "#120E10",
      karta: "#1A1417",
      karta2: "#241B1F",
      tekst: "#F6EEEC",
      tekstPrzygaszony: "#B5A6A6",
      akcent: "#DDA591",
      akcentTekst: "#120E10",
      // Prototype rose-gold frame rgba(222,164,145,.55) over the card.
      obrys: "#86635A",
    },
    werdykty: WERDYKTY_CIEMNE,
    // Prototype: metallic gradient on the result number — left out (a gradient text has no single
    // colour to test for contrast); the result keeps the verdict text colour.
    warianty: { naglowki: "szeryf", liczby: "szeryf", promien: 1 },
  },
  {
    id: "pomarancz-sygnalowy",
    nazwaKlucz: "UI-STYL-POMARANCZ",
    opisKlucz: "UI-STYL-POMARANCZ-OPIS",
    grupa: "premium",
    dostepnosc: "nieustalona",
    schemat: "ciemny",
    tokeny: {
      tlo: "#101113",
      karta: "#17191C",
      karta2: "#1F2226",
      tekst: "#F2F2F0",
      tekstPrzygaszony: "#A0A4AA",
      akcent: "#FF6B1A",
      akcentTekst: "#111111",
      // Prototype frame rgba(255,255,255,.14) is ≈1.5:1; neutral grey lifted to 3:1.
      obrys: "#6B6C6F",
      // D65: the ring is neutral, not orange. Prototype ring rgba(255,255,255,.3) is 2.7:1 on the
      // card; the prototype's own neutral grey (--muted) is used instead.
      pierscien: "#A0A4AA",
    },
    werdykty: WERDYKTY_POMARANCZ,
    warianty: { naglowki: "szeryf", liczby: "szeryf", promien: 1 },
    // D65: orange only on edges, buttons and navigation — the card edge here, buttons/nav through
    // `--primary`; verdict boxes are excluded from card effects by `SELEKTOR_KARTY`.
    efekty: { karta: { krawedzAkcentu: true } },
  },
  {
    id: "zachod-slonca",
    nazwaKlucz: "UI-STYL-ZACHOD",
    opisKlucz: "UI-STYL-ZACHOD-OPIS",
    grupa: "premium",
    dostepnosc: "nieustalona",
    schemat: "ciemny",
    tokeny: {
      tlo: "#150F1C",
      karta: "#1D1526",
      karta2: "#271C33",
      tekst: "#FBF1EA",
      tekstPrzygaszony: "#B8A7B5",
      akcent: "#FFB08A",
      akcentTekst: "#150F1C",
      // Prototype peach frame rgba(255,168,120,.5) over the card is #8E5F4F, 2.997:1 on the second
      // surface; one step lighter.
      obrys: "#8F6151",
    },
    werdykty: WERDYKTY_CIEMNE,
    warianty: { naglowki: "szeryf", liczby: "szeryf", promien: 1 },
  },
  {
    id: "oled-oszczedny",
    nazwaKlucz: "UI-STYL-OLED",
    opisKlucz: "UI-STYL-OLED-OPIS",
    grupa: "premium",
    dostepnosc: "nieustalona",
    schemat: "ciemny",
    tokeny: {
      tlo: "#000000",
      karta: "#000000",
      karta2: "#000000",
      tekst: "#D9D9D9",
      tekstPrzygaszony: "#7A7A7A",
      akcent: "#BDBDBD",
      akcentTekst: "#000000",
      // Prototype frame #262626 is ≈1.4:1 on black — invisible field borders.
      obrys: "#5C5C5C",
    },
    werdykty: WERDYKTY_CIEMNE,
    // Prototype: thin (300) Inter numbers. Inter is loaded 400–700 only (a 300 file would be
    // preloaded on every page for one style), so numbers stay sans at the regular weight.
    warianty: { naglowki: "bezszeryf", liczby: "bezszeryf", promien: 0.875 },
  },
  {
    id: "jasny-architektoniczny",
    nazwaKlucz: "UI-STYL-JASNY-ARCH",
    opisKlucz: "UI-STYL-JASNY-ARCH-OPIS",
    grupa: "jasne",
    dostepnosc: "pro",
    schemat: "jasny",
    tokeny: {
      tlo: "#F3EEE4",
      karta: "#FCFAF5",
      karta2: "#EFE7D7",
      tekst: "#1E2430",
      tekstPrzygaszony: "#5D6472",
      // Prototype accent #A47D3C gives 3.8:1 under white button text; its darker pair #8A6A2E
      // (prototype --acc2, the button gradient end) passes.
      akcent: "#8A6A2E",
      akcentTekst: "#FFFFFF",
      obrys: "#7D828C",
    },
    werdykty: WERDYKTY_JASNE,
    warianty: { naglowki: "szeryf", liczby: "szeryf", promien: 1 },
  },
  {
    id: "pudrowy-roz",
    nazwaKlucz: "UI-STYL-PUDROWY-ROZ",
    opisKlucz: "UI-STYL-PUDROWY-ROZ-OPIS",
    grupa: "jasne",
    dostepnosc: "nieustalona",
    schemat: "jasny",
    tokeny: {
      tlo: "#F7EEF0",
      karta: "#FFFAFB",
      karta2: "#FFFFFF",
      tekst: "#2B1D24",
      tekstPrzygaszony: "#77626B",
      akcent: "#9E4F72",
      akcentTekst: "#FFFFFF",
      // Prototype frame #EBCBD4 is ≈1.4:1 (a decorative line); same hue darkened to 3:1.
      obrys: "#99848A",
    },
    werdykty: WERDYKTY_JASNE,
    warianty: { naglowki: "szeryf", liczby: "szeryf", promien: 1 },
  },
  {
    id: "sloneczny-poranek",
    nazwaKlucz: "UI-STYL-SLONECZNY",
    opisKlucz: "UI-STYL-SLONECZNY-OPIS",
    grupa: "jasne",
    dostepnosc: "nieustalona",
    schemat: "jasny",
    tokeny: {
      tlo: "#FFF7E8",
      karta: "#FFFDF7",
      karta2: "#FFFFFF",
      tekst: "#1D2A3A",
      // Prototype #5E6878 is 4.33:1 on the sky blue at the top of the page; one step darker.
      tekstPrzygaszony: "#5B6574",
      akcent: "#1F4E86",
      akcentTekst: "#FFFFFF",
      // Prototype frame #F1DDB0 is ≈1.3:1; same hue darkened to 3:1 (also on the sky blue).
      obrys: "#897E64",
    },
    werdykty: WERDYKTY_JASNE,
    warianty: { naglowki: "szeryf", liczby: "szeryf", promien: 1 },
    efekty: {
      // Prototype sky: #CFE4FA at the top → #E8F1FB → the warm white page at 36 %.
      tlo: {
        obraz: "linear-gradient(180deg,#CFE4FA 0%,#E8F1FB 14%,#FFF7E8 36%)",
        kolory: ["#CFE4FA", "#E8F1FB"],
      },
    },
  },
  {
    id: "rozdzielnica",
    nazwaKlucz: "UI-STYL-ROZDZIELNICA",
    opisKlucz: "UI-STYL-ROZDZIELNICA-OPIS",
    grupa: "jasne",
    dostepnosc: "nieustalona",
    schemat: "jasny",
    tokeny: {
      tlo: "#C9CEC9",
      karta: "#E4E7E3",
      karta2: "#EEF0EC",
      tekst: "#1B1F1D",
      tekstPrzygaszony: "#4D5451",
      akcent: "#0057B8",
      akcentTekst: "#FFFFFF",
      // Prototype frame #9EA5A0 is ≈1.6:1 on the housing grey.
      obrys: "#6B716E",
    },
    werdykty: WERDYKTY_ROZDZIELNICA,
    warianty: { naglowki: "bezszeryf", liczby: "mono", promien: 0.25 },
  },
  {
    id: "e-ink",
    nazwaKlucz: "UI-STYL-EINK",
    opisKlucz: "UI-STYL-EINK-OPIS",
    grupa: "jasne",
    dostepnosc: "nieustalona",
    schemat: "jasny",
    // D67: a look, not support for e-ink readers (no refresh or ghosting handling).
    tokeny: {
      tlo: "#ECEBE6",
      karta: "#ECEBE6",
      karta2: "#ECEBE6",
      tekst: "#111111",
      tekstPrzygaszony: "#444444",
      akcent: "#111111",
      akcentTekst: "#ECEBE6",
      obrys: "#1A1A1A",
    },
    werdykty: WERDYKTY_JASNE,
    warianty: { naglowki: "szeryf", liczby: "szeryf", promien: 0.375 },
  },
  {
    id: "marmur-zloto",
    nazwaKlucz: "UI-STYL-MARMUR",
    opisKlucz: "UI-STYL-MARMUR-OPIS",
    grupa: "jasne",
    dostepnosc: "nieustalona",
    schemat: "jasny",
    tokeny: {
      tlo: "#F7F5F1",
      karta: "#FFFFFF",
      karta2: "#FFFFFF",
      tekst: "#1E1C19",
      // Prototype #6C665C is 4.36:1 on a marble vein; one step darker.
      tekstPrzygaszony: "#696359",
      // Prototype gold #A8843D is 3.5:1 on white (button text and links); same hue 14 % darker.
      akcent: "#907234",
      akcentTekst: "#FFFFFF",
      // Prototype gold frame #C9AA67 is ≈2.1:1; same hue darkened to 3:1 (also on the marble veins).
      obrys: "#947D4B",
    },
    werdykty: WERDYKTY_JASNE,
    warianty: { naglowki: "szeryf", liczby: "szeryf", promien: 1.125 },
    efekty: {
      // Prototype marble: three faint veins rgba(150,145,140,.08–.12) over a white → #EFECE6 glow.
      tlo: {
        obraz:
          "linear-gradient(115deg,transparent 40%,rgba(150,145,140,.12) 41%,transparent 43%),linear-gradient(160deg,transparent 60%,rgba(150,145,140,.1) 61%,transparent 62.5%),linear-gradient(35deg,transparent 20%,rgba(150,145,140,.08) 21%,transparent 22%),radial-gradient(80% 60% at 70% 20%,#FFFFFF,#EFECE6)",
        kolory: ["#FFFFFF", "#EFECE6", "#E4E1DB"],
      },
    },
  },
  {
    id: "zen",
    nazwaKlucz: "UI-STYL-ZEN",
    opisKlucz: "UI-STYL-ZEN-OPIS",
    grupa: "jasne",
    dostepnosc: "nieustalona",
    schemat: "jasny",
    tokeny: {
      tlo: "#F6F3EC",
      karta: "#F6F3EC",
      karta2: "#F6F3EC",
      tekst: "#1C1B19",
      tekstPrzygaszony: "#6B665C",
      akcent: "#26457A",
      akcentTekst: "#FFFFFF",
      // D67: field outlines (WCAG 1.4.11). Prototype line #D9D3C6 is ≈1.4:1; same hue darkened to 3:1.
      obrys: "#8F8B83",
    },
    werdykty: WERDYKTY_JASNE,
    warianty: { naglowki: "szeryf", liczby: "szeryf", promien: 0.125 },
  },
  {
    id: "holograficzny",
    nazwaKlucz: "UI-STYL-HOLO",
    opisKlucz: "UI-STYL-HOLO-OPIS",
    grupa: "eksperymentalne",
    dostepnosc: "nieustalona",
    schemat: "ciemny",
    tokeny: {
      tlo: "#0B0B12",
      karta: "#12121C",
      karta2: "#181826",
      tekst: "#F4F3FA",
      tekstPrzygaszony: "#A4A3B8",
      akcent: "#C9B8FF",
      akcentTekst: "#0B0B12",
      // Prototype cards have only the rainbow frame (no line colour); fields take the prototype chip border.
      obrys: "#8E7BD9",
    },
    werdykty: WERDYKTY_CIEMNE,
    // Prototype pearl gradient on the result number left out (no single colour to test).
    warianty: { naglowki: "szeryf", liczby: "szeryf", promien: 1 },
    efekty: {
      // Prototype holo foil colours. Prototype: a conic gradient turned by an animated @property
      // angle; here a linear gradient slid sideways — same colours, no @property needed. Off under
      // prefers-reduced-motion (D66); cards only, never verdict/warning boxes (SELEKTOR_KARTY).
      karta: { teczowa: { kolory: ["#7DF9FF", "#B388FF", "#FF9AD5", "#FFE59A", "#9DFFCB", "#7DF9FF"], sekundy: 9 } },
    },
  },
  {
    id: "kokpit-hud",
    nazwaKlucz: "UI-STYL-HUD",
    opisKlucz: "UI-STYL-HUD-OPIS",
    grupa: "eksperymentalne",
    dostepnosc: "nieustalona",
    schemat: "ciemny",
    tokeny: {
      tlo: "#03080A",
      karta: "#061115",
      karta2: "#081820",
      tekst: "#DDFBF6",
      tekstPrzygaszony: "#7FA7A3",
      akcent: "#5EEAD4",
      akcentTekst: "#03080A",
      // Prototype turquoise frame rgba(94,234,212,.22) over the card is ≈1.7:1; lifted 27 % towards the turquoise.
      obrys: "#2C6F67",
    },
    // D66: turquoise vs 🟢 for deuteranopia — colour-vision test in `__tests__/style.test.ts`.
    werdykty: WERDYKTY_CIEMNE,
    warianty: { naglowki: "mono", liczby: "mono", promien: 0.125, wynik: { czcionka: "mono" } },
    efekty: {
      // Prototype scan lines: 1 px rgba(94,234,212,.035) every 3 px (hairlines only).
      tlo: { obraz: "repeating-linear-gradient(0deg,rgba(94,234,212,.035) 0 1px,transparent 1px 3px)", kolory: [] },
    },
  },
  {
    id: "szklo",
    nazwaKlucz: "UI-STYL-SZKLO",
    opisKlucz: "UI-STYL-SZKLO-OPIS",
    grupa: "eksperymentalne",
    dostepnosc: "nieustalona",
    schemat: "ciemny",
    tokeny: {
      tlo: "#0B1420",
      // Opaque fallback of the prototype glass rgba(255,255,255,.08) / .12 over the page.
      karta: "#1F2732",
      karta2: "#28303B",
      tekst: "#FFFFFF",
      tekstPrzygaszony: "#C9D3E0",
      akcent: "#FFFFFF",
      akcentTekst: "#0B1420",
      // Prototype frame rgba(255,255,255,.22) over the glass is ≈1.8–2.5:1; lifted to 3:1 (also on
      // the glass over the glow).
      obrys: "#7D8288",
    },
    werdykty: WERDYKTY_CIEMNE,
    warianty: { naglowki: "szeryf", liczby: "szeryf", promien: 1 },
    efekty: {
      // Prototype background = the blurred house photo, which is not in the app (photo licence, D61).
      // Stand-in from the prototype's own colours: the nav glass #141E2D and a soft --ic2 #BFE3FF
      // glow — at 8 %, because at 14 % the glass over it put the 🔴 border under 3:1.
      tlo: {
        obraz: "radial-gradient(60% 45% at 25% 10%,rgba(191,227,255,.08),transparent 70%),linear-gradient(180deg,#0B1420,#141E2D)",
        kolory: ["#192532", "#141E2D"],
      },
      // D66: fallback without blur — see EfektyStylu.
      karta: { szklo: { kolor: "#FFFFFF", krycie: 0.08, rozmycie: 16 } },
    },
  },
  {
    id: "brutalizm",
    nazwaKlucz: "UI-STYL-BRUTALIZM",
    opisKlucz: "UI-STYL-BRUTALIZM-OPIS",
    grupa: "eksperymentalne",
    dostepnosc: "nieustalona",
    schemat: "jasny",
    tokeny: {
      tlo: "#F4F2EC",
      karta: "#FFFFFF",
      karta2: "#FFFFFF",
      tekst: "#000000",
      tekstPrzygaszony: "#3A3A3A",
      akcent: "#2438FF",
      akcentTekst: "#FFFFFF",
      obrys: "#000000",
    },
    werdykty: WERDYKTY_JASNE,
    warianty: { naglowki: "mono", liczby: "mono", promien: 0, wynik: { czcionka: "mono" } },
    efekty: { karta: { cien: "4px 4px 0 #000" } },
  },
  {
    id: "orbita",
    nazwaKlucz: "UI-STYL-ORBITA",
    opisKlucz: "UI-STYL-ORBITA-OPIS",
    grupa: "eksperymentalne",
    dostepnosc: "nieustalona",
    schemat: "ciemny",
    tokeny: {
      tlo: "#04050A",
      karta: "#0A0C16",
      karta2: "#10132A",
      tekst: "#F1EEFF",
      tekstPrzygaszony: "#9B98B8",
      akcent: "#A78BFA",
      akcentTekst: "#04050A",
      // Prototype violet frame rgba(167,139,250,.4) over the card is ≈2:1; lifted 33 % towards the violet.
      obrys: "#68589E",
    },
    werdykty: WERDYKTY_CIEMNE,
    warianty: { naglowki: "szeryf", liczby: "szeryf", promien: 1.25 },
    efekty: {
      // Prototype stars (1–1.5 px points, not areas); the planet sat on the house photo and is left out.
      tlo: {
        obraz:
          "radial-gradient(1px 1px at 20px 30px,#fff,transparent) 0 0/280px 220px,radial-gradient(1px 1px at 80px 120px,rgba(255,255,255,.8),transparent) 0 0/280px 220px,radial-gradient(1.5px 1.5px at 150px 60px,#fff,transparent) 0 0/280px 220px,radial-gradient(1px 1px at 230px 180px,rgba(255,255,255,.7),transparent) 0 0/280px 220px",
        kolory: [],
      },
    },
  },
  {
    id: "neumorfizm",
    nazwaKlucz: "UI-STYL-NEUMORFIZM",
    opisKlucz: "UI-STYL-NEUMORFIZM-OPIS",
    grupa: "eksperymentalne",
    dostepnosc: "nieustalona",
    schemat: "jasny",
    tokeny: {
      tlo: "#E3E7EE",
      karta: "#E3E7EE",
      karta2: "#E3E7EE",
      tekst: "#1F2633",
      tekstPrzygaszony: "#5B6474",
      akcent: "#4F46E5",
      akcentTekst: "#FFFFFF",
      // D66: field outlines (WCAG 1.4.11). Prototype has no frames (line #CDD3DD ≈1.2:1); same hue darkened to 3:1.
      obrys: "#7F8389",
    },
    werdykty: WERDYKTY_JASNE,
    warianty: { naglowki: "szeryf", liczby: "szeryf", promien: 1.25 },
    efekty: { karta: { cien: "7px 7px 14px #C3C9D3,-7px -7px 14px #FFFFFF" } },
  },
  {
    id: "notatnik-inzyniera",
    nazwaKlucz: "UI-STYL-NOTATNIK",
    opisKlucz: "UI-STYL-NOTATNIK-OPIS",
    grupa: "eksperymentalne",
    dostepnosc: "nieustalona",
    schemat: "jasny",
    tokeny: {
      tlo: "#F6F2E6",
      karta: "#FFFDF6",
      karta2: "#FFFDF6",
      tekst: "#23262B",
      tekstPrzygaszony: "#5F6268",
      akcent: "#1D4ED8",
      akcentTekst: "#FFFFFF",
      // Prototype hand-drawn card outline #3A3D42 (the page frame #C9C2AE is ≈1.6:1).
      obrys: "#3A3D42",
    },
    werdykty: WERDYKTY_JASNE,
    // D67: Caveat (has Cyrillic) only in headings and the result; numbers in tables and forms in Inter.
    warianty: { naglowki: "odreczne", liczby: "bezszeryf", promien: 0.75, wynik: { czcionka: "odreczne" } },
    efekty: {
      // Prototype squared paper: 1 px rgba(29,78,216,.09) every 12 px (hairlines only).
      tlo: {
        obraz:
          "linear-gradient(rgba(29,78,216,.09) 1px,transparent 1px) 0 0/12px 12px,linear-gradient(90deg,rgba(29,78,216,.09) 1px,transparent 1px) 0 0/12px 12px",
        kolory: [],
      },
    },
  },
  {
    id: "plynny-gradient",
    nazwaKlucz: "UI-STYL-PLYNNY",
    opisKlucz: "UI-STYL-PLYNNY-OPIS",
    grupa: "eksperymentalne",
    dostepnosc: "nieustalona",
    schemat: "ciemny",
    tokeny: {
      tlo: "#0B0F2A",
      // Opaque fallback of the prototype glass rgba(10,14,40,.55) over the page.
      karta: "#0A0E29",
      karta2: "#0A0E29",
      tekst: "#F5F7FF",
      tekstPrzygaszony: "#BAC2E0",
      akcent: "#FFFFFF",
      akcentTekst: "#0B0F2A",
      // Prototype frame rgba(255,255,255,.16) is ≈1.6:1; lifted to 3:1 (also on the blobs).
      obrys: "#777988",
    },
    werdykty: WERDYKTY_CIEMNE,
    warianty: { naglowki: "szeryf", liczby: "bezszeryf", promien: 1.25 },
    efekty: {
      // Prototype blobs #5B21B6 / #0E7490 / #1D4ED8 at full strength put 🔴, 🟢 and secondary text
      // under 3:1 / 4.5:1 where text sits straight on the page; here at 35 % over the page colour.
      // D67: moving only on the dashboard, still on calculators (and under reduced motion).
      tloRuchome: {
        obraz:
          "radial-gradient(60% 45% at 20% 15%,#27155B 0%,transparent 70%),radial-gradient(55% 45% at 90% 45%,#0C324E 0%,transparent 70%),radial-gradient(60% 50% at 30% 90%,#112567 0%,transparent 70%)",
        kolory: ["#27155B", "#0C324E", "#112567"],
        od: "0% 0%,100% 0%,0% 100%",
        do: "100% 100%,0% 100%,100% 0%",
        sekundy: 24,
      },
      karta: { szklo: { kolor: "#0A0E28", krycie: 0.55, rozmycie: 10 } },
    },
  },
  {
    id: "synthwave",
    nazwaKlucz: "UI-STYL-SYNTHWAVE",
    opisKlucz: "UI-STYL-SYNTHWAVE-OPIS",
    grupa: "ukryte",
    dostepnosc: "nieustalona",
    schemat: "ciemny",
    tokeny: {
      tlo: "#14052B",
      karta: "#1C0A3A",
      karta2: "#26104C",
      tekst: "#FDF3FF",
      tekstPrzygaszony: "#B9A6D6",
      akcent: "#2DE2E6",
      akcentTekst: "#14052B",
      // Prototype turquoise frame rgba(45,226,230,.5) over the card.
      obrys: "#257690",
    },
    werdykty: WERDYKTY_CIEMNE,
    warianty: { naglowki: "szeryf", liczby: "szeryf", promien: 1 },
    efekty: {
      // Prototype neon pink grid rgba(255,62,165,.45) at the bottom of the screen (1 px lines, flat —
      // the prototype's 3D perspective tilt needs a pseudo-element and is left out), faded into the
      // page. Page background only: never on a verdict or warning card (D66).
      tlo: {
        obraz:
          "linear-gradient(#14052B,rgba(20,5,43,0)) bottom/100% 170px no-repeat,repeating-linear-gradient(0deg,rgba(255,62,165,.45) 0 1px,transparent 1px 18px) bottom/100% 170px no-repeat,repeating-linear-gradient(90deg,rgba(255,62,165,.45) 0 1px,transparent 1px 28px) bottom/100% 170px no-repeat",
        kolory: [],
      },
    },
  },
  {
    id: "terminal-dos",
    nazwaKlucz: "UI-STYL-DOS",
    opisKlucz: "UI-STYL-DOS-OPIS",
    grupa: "ukryte",
    dostepnosc: "nieustalona",
    schemat: "ciemny",
    tokeny: {
      tlo: "#0000A8",
      karta: "#0000A8",
      karta2: "#0000A8",
      tekst: "#FFFFFF",
      tekstPrzygaszony: "#AAAAAA",
      akcent: "#55FFFF",
      akcentTekst: "#000000",
      obrys: "#55FFFF",
    },
    // D67: 🔴 on the blue — the dark set passes the contrast test unchanged (tested like every style).
    werdykty: WERDYKTY_CIEMNE,
    // D67: result white, never the 🟡 yellow; monospace everywhere.
    warianty: { naglowki: "mono", liczby: "mono", promien: 0, wynik: { czcionka: "mono", kolor: "#FFFFFF" }, tekst: "mono" },
  },
] as const satisfies readonly StylWygladu[]

export type StylId = (typeof STYLE_WYGLADU)[number]["id"]

export function znajdzStyl(id: unknown): StylWygladu | undefined {
  return (STYLE_WYGLADU as readonly StylWygladu[]).find((s) => s.id === id)
}

export function jestStylem(id: unknown): id is StylId {
  return znajdzStyl(id) !== undefined
}

export type PoziomWerdyktu = "ok" | "uwaga" | "blad"

/** Background of a verdict box: the verdict base mixed over the card, as one literal hex. */
export function tloWerdyktu(styl: StylWygladu, poziom: PoziomWerdyktu): string {
  return zmieszaj(styl.werdykty[poziom], styl.tokeny.karta, styl.werdykty.udzialTla)
}

/** Structural validation of the table; returns a list of problems (empty = valid). */
export function walidujStyle(style: readonly StylWygladu[]): string[] {
  const problemy: string[] = []
  const grupy = new Set(GRUPY_STYLOW.map((g) => g.id))
  const widziane = new Set<string>()
  for (const s of style) {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s.id)) problemy.push(`${s.id}: id is not kebab-case`)
    if (widziane.has(s.id)) problemy.push(`${s.id}: duplicate id`)
    widziane.add(s.id)
    if (!grupy.has(s.grupa)) problemy.push(`${s.id}: unknown group ${s.grupa}`)
    if (!s.nazwaKlucz.startsWith("UI-") || !s.opisKlucz.startsWith("UI-")) problemy.push(`${s.id}: name/description key must start with UI-`)
    for (const [k, v] of Object.entries(s.tokeny)) if (!jestHeksem(v)) problemy.push(`${s.id}: tokeny.${k} is not #rrggbb`)
    for (const [k, v] of Object.entries(s.werdykty)) {
      if (k === "udzialTla") continue
      if (!jestHeksem(v)) problemy.push(`${s.id}: werdykty.${k} is not #rrggbb`)
    }
    if (!(s.werdykty.udzialTla > 0 && s.werdykty.udzialTla <= 0.3)) problemy.push(`${s.id}: werdykty.udzialTla outside (0, 0.3]`)
    if (!(s.warianty.promien >= 0 && s.warianty.promien <= 1.5)) problemy.push(`${s.id}: warianty.promien outside [0, 1.5] rem`)
    const kolorWyniku = s.warianty.wynik?.kolor
    if (kolorWyniku !== undefined && !jestHeksem(kolorWyniku)) problemy.push(`${s.id}: warianty.wynik.kolor is not #rrggbb`)
    const e = s.efekty
    for (const k of [...(e?.tlo?.kolory ?? []), ...(e?.tloRuchome?.kolory ?? [])])
      if (!jestHeksem(k)) problemy.push(`${s.id}: efekty background colour ${k} is not #rrggbb`)
    const szklo = e?.karta?.szklo
    if (szklo && (!jestHeksem(szklo.kolor) || !(szklo.krycie > 0 && szklo.krycie < 1) || !(szklo.rozmycie > 0)))
      problemy.push(`${s.id}: efekty.karta.szklo needs a #rrggbb colour, opacity in (0, 1) and blur > 0`)
    for (const k of e?.karta?.teczowa?.kolory ?? []) if (!jestHeksem(k)) problemy.push(`${s.id}: rainbow colour ${k} is not #rrggbb`)
  }
  return problemy
}

const SZERYF = "var(--font-source-serif), Georgia, serif"
const MONO = "var(--font-jetbrains-mono), ui-monospace, monospace"
const ODRECZNE = "var(--font-caveat), cursive"

/** "bezszeryf" = the sans font the user picked in the settings (`--font-sans-user`, `./storage.ts`). */
const FONT_NAGLOWKA: Record<WariantyStylu["naglowki"], string> = {
  szeryf: SZERYF,
  bezszeryf: "var(--font-sans-user)",
  mono: MONO,
  odreczne: ODRECZNE,
}

const FONT_LICZB: Record<WariantyStylu["liczby"], string> = {
  szeryf: SZERYF,
  mono: MONO,
  bezszeryf: "var(--font-sans-user)",
}

const FONT_WYNIKU: Record<NonNullable<NonNullable<WariantyStylu["wynik"]>["czcionka"]>, string> = {
  odreczne: ODRECZNE,
  mono: MONO,
}

/** CSS custom properties of one style (token → value), in the names `app/globals.css` uses. */
export function zmienneStylu(s: StylWygladu): Record<string, string> {
  const t = s.tokeny
  const w = s.werdykty
  const pierscien = t.pierscien ?? t.akcent
  const wynik = s.warianty.wynik
  return {
    "--background": t.tlo,
    "--foreground": t.tekst,
    "--card": t.karta,
    "--card-foreground": t.tekst,
    "--popover": t.karta,
    "--popover-foreground": t.tekst,
    "--primary": t.akcent,
    "--primary-foreground": t.akcentTekst,
    "--secondary": t.karta2,
    "--secondary-foreground": t.tekst,
    "--muted": t.karta2,
    "--muted-foreground": t.tekstPrzygaszony,
    "--accent": t.karta2,
    "--accent-foreground": t.tekst,
    "--destructive": w.blad,
    "--border": t.obrys,
    "--input": t.obrys,
    "--ring": pierscien,
    "--sidebar": t.karta,
    "--sidebar-foreground": t.tekst,
    "--sidebar-primary": t.akcent,
    "--sidebar-primary-foreground": t.akcentTekst,
    "--sidebar-accent": t.karta2,
    "--sidebar-accent-foreground": t.tekst,
    "--sidebar-border": t.obrys,
    "--sidebar-ring": pierscien,
    "--werdykt-ok": w.ok,
    "--werdykt-ok-bg": tloWerdyktu(s, "ok"),
    "--werdykt-ok-border": "var(--werdykt-ok)",
    "--werdykt-ok-foreground": w.okTekst,
    "--werdykt-uwaga": w.uwaga,
    "--werdykt-uwaga-bg": tloWerdyktu(s, "uwaga"),
    "--werdykt-uwaga-border": "var(--werdykt-uwaga)",
    "--werdykt-uwaga-foreground": w.uwagaTekst,
    "--werdykt-blad": w.blad,
    "--werdykt-blad-bg": tloWerdyktu(s, "blad"),
    "--werdykt-blad-border": "var(--werdykt-blad)",
    "--werdykt-blad-foreground": w.bladTekst,
    "--font-naglowek": FONT_NAGLOWKA[s.warianty.naglowki],
    "--font-liczby": FONT_LICZB[s.warianty.liczby],
    ...(wynik?.czcionka ? { "--font-wynik": FONT_WYNIKU[wynik.czcionka] } : {}),
    ...(wynik?.kolor ? { "--kolor-wyniku": wynik.kolor } : {}),
    ...(s.warianty.tekst === "mono" ? { "--font-tekst": MONO } : {}),
    "--radius": `${s.warianty.promien}rem`,
  }
}

/** `#rrggbb` + opacity → `rgba(…)`, for glass surfaces. */
function rgba(hex: string, krycie: number): string {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return `rgba(${r},${g},${b},${krycie})`
}

const BEZ_RUCHU = "@media (prefers-reduced-motion:no-preference)"

/**
 * Extra rules of one style's `efekty` (one rule per line). Conditions of D66/D67 live here, so an
 * entry in the table cannot break them: card effects only on `SELEKTOR_KARTY`; animations only
 * inside `BEZ_RUCHU`; the moving background only on the dashboard; glass blur only where
 * supported, wanted and affordable, otherwise the opaque card colour.
 */
export function cssEfektow(s: StylWygladu): string[] {
  const e = s.efekty
  if (!e) return []
  const root = `html:root[data-styl="${s.id}"]`
  const karta = `${root} ${SELEKTOR_KARTY}`
  const reguly: string[] = []

  const tlo = e.tlo ?? e.tloRuchome
  if (tlo) {
    // The decoration sits on <body>, fixed to the viewport; page wrappers that paint their own
    // `bg-background` over the whole screen are made transparent so it shows through.
    const rozmiar = e.tloRuchome ? "background-size:150% 150%;" : ""
    const pozycja = e.tloRuchome ? `background-position:${e.tloRuchome.od};` : ""
    reguly.push(`${root} body{background:${tlo.obraz},var(--background);background-attachment:fixed;${rozmiar}${pozycja}}`)
    reguly.push(`${root} .min-h-screen.bg-background{background-color:transparent}`)
  }
  if (e.tloRuchome) {
    const nazwa = `styl-${s.id}-tlo`
    reguly.push(`@keyframes ${nazwa}{to{background-position:${e.tloRuchome.do}}}`)
    reguly.push(`${BEZ_RUCHU}{${root}:has([data-pulpit]) body{animation:${nazwa} ${e.tloRuchome.sekundy}s ease-in-out infinite alternate}}`)
  }

  const k = e.karta
  if (k?.cien) reguly.push(`${karta}{box-shadow:${k.cien}}`)
  if (k?.krawedzAkcentu) reguly.push(`${karta}{border-left:3px solid var(--primary)}`)
  if (k?.teczowa) {
    const nazwa = `styl-${s.id}-teczowa`
    reguly.push(
      `${karta}{border-color:transparent;background:linear-gradient(var(--card),var(--card)) padding-box,linear-gradient(115deg,${k.teczowa.kolory.join(",")}) 0 0/300% 100% border-box}`,
    )
    reguly.push(`@keyframes ${nazwa}{to{background-position:0 0,100% 0}}`)
    reguly.push(`${BEZ_RUCHU}{${karta}{animation:${nazwa} ${k.teczowa.sekundy}s linear infinite alternate}}`)
  }
  if (k?.szklo) {
    const szklo = rgba(k.szklo.kolor, k.szklo.krycie)
    const blur = `blur(${k.szklo.rozmycie}px) saturate(1.3)`
    reguly.push(`${karta}{background-color:var(--card)}`)
    reguly.push(
      `@supports ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){${root}:not([data-bez-rozmycia]) ${SELEKTOR_KARTY}{background-color:${szklo};-webkit-backdrop-filter:${blur};backdrop-filter:${blur}}}`,
    )
    reguly.push(
      `@media (prefers-reduced-transparency:reduce){${root}:not([data-bez-rozmycia]) ${SELEKTOR_KARTY}{background-color:var(--card);-webkit-backdrop-filter:none;backdrop-filter:none}}`,
    )
  }
  return reguly
}

/**
 * The stylesheet for all styles. Selector `html:root[data-styl="…"]` (specificity 0,2,1) beats
 * both `.dark` and `:root:not(.light)` from `globals.css`, whatever order the sheets load in; the
 * user's overrides are inline on `<html>` and beat it in turn. Token rule first, then the style's
 * `efekty` rules, one per line.
 */
export function generujCssStylow(style: readonly StylWygladu[] = STYLE_WYGLADU): string {
  return style
    .flatMap((s) => {
      const deklaracje = Object.entries(zmienneStylu(s))
        .map(([k, v]) => `${k}:${v};`)
        .join("")
      return [
        `html:root[data-styl="${s.id}"]{color-scheme:${s.schemat === "ciemny" ? "dark" : "light"};${deklaracje}}`,
        ...cssEfektow(s),
      ]
    })
    .join("\n")
}

/** id → class the style forces on `<html>` (`light`/`dark`), for the pre-hydration script in the layout. */
export function schematyStylow(style: readonly StylWygladu[] = STYLE_WYGLADU): Record<string, "light" | "dark"> {
  return Object.fromEntries(style.map((s) => [s.id, s.schemat === "ciemny" ? "dark" : "light"]))
}
