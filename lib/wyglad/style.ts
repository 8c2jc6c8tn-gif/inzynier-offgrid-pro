/**
 * Appearance styles ("Style wyglądu") — the ONE table every style lives in (decisions D63–D67,
 * `rejestr-decyzji.md`; `docs/lista-do-zrobienia.md`, entry „Tryb wyglądu Premium”). A style is a
 * set of token values plus a few component variants, not a rewrite of screens
 * (`docs/opis-ekranow-dla-ai.md`, section 8). The CSS for every style is generated from this table
 * (`generujCssStylow`, injected by `app/layout.tsx`) — nothing is hand-written per style in
 * `app/globals.css`, so adding a style is one entry here plus its names in `lib/i18n/ui/wyglad.ts`.
 *
 * Source of the colours: the owner-approved prototype https://claude.ai/artifact/JsYnhZYECTQtSTAPAj4kmL
 * (live preview `.dev` tokens for styles 1–3, board `.bp.n19`/`.bp.n21` for Rozdzielnica and OLED).
 * Deviations from the prototype are deliberate and listed at each value: every one of them comes
 * from the WCAG contrast test (`__tests__/style.test.ts`) failing on the prototype value.
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
  /** Headings h1–h3. */
  naglowki: "szeryf" | "bezszeryf"
  /** Result numbers (`tabular-nums`). */
  liczby: "szeryf" | "mono" | "bezszeryf"
  /** Corner radius, rem → `--radius`. */
  promien: number
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
}

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
  }
  return problemy
}

/** "bezszeryf" = the sans font the user picked in the settings (`--font-sans-user`, `./storage.ts`). */
const FONT_NAGLOWKA: Record<WariantyStylu["naglowki"], string> = {
  szeryf: "var(--font-source-serif), Georgia, serif",
  bezszeryf: "var(--font-sans-user)",
}

const FONT_LICZB: Record<WariantyStylu["liczby"], string> = {
  szeryf: "var(--font-source-serif), Georgia, serif",
  mono: "var(--font-jetbrains-mono), ui-monospace, monospace",
  bezszeryf: "var(--font-sans-user)",
}

/** CSS custom properties of one style (token → value), in the names `app/globals.css` uses. */
export function zmienneStylu(s: StylWygladu): Record<string, string> {
  const t = s.tokeny
  const w = s.werdykty
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
    "--ring": t.akcent,
    "--sidebar": t.karta,
    "--sidebar-foreground": t.tekst,
    "--sidebar-primary": t.akcent,
    "--sidebar-primary-foreground": t.akcentTekst,
    "--sidebar-accent": t.karta2,
    "--sidebar-accent-foreground": t.tekst,
    "--sidebar-border": t.obrys,
    "--sidebar-ring": t.akcent,
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
    "--radius": `${s.warianty.promien}rem`,
  }
}

/**
 * The stylesheet for all styles. Selector `html:root[data-styl="…"]` (specificity 0,2,1) beats
 * both `.dark` and `:root:not(.light)` from `globals.css`, whatever order the sheets load in; the
 * user's overrides are inline on `<html>` and beat it in turn.
 */
export function generujCssStylow(style: readonly StylWygladu[] = STYLE_WYGLADU): string {
  return style
    .map((s) => {
      const deklaracje = Object.entries(zmienneStylu(s))
        .map(([k, v]) => `${k}:${v};`)
        .join("")
      return `html:root[data-styl="${s.id}"]{color-scheme:${s.schemat === "ciemny" ? "dark" : "light"};${deklaracje}}`
    })
    .join("\n")
}

/** id → class the style forces on `<html>` (`light`/`dark`), for the pre-hydration script in the layout. */
export function schematyStylow(style: readonly StylWygladu[] = STYLE_WYGLADU): Record<string, "light" | "dark"> {
  return Object.fromEntries(style.map((s) => [s.id, s.schemat === "ciemny" ? "dark" : "light"]))
}
