import { describe, expect, it } from "vitest"
import { uiEn, uiPl, uiRu } from "@/lib/i18n/ui"
import { kontrast, luminancja, zmieszaj } from "../kolor"
import {
  GRUPY_STYLOW,
  STYLE_WYGLADU,
  generujCssStylow,
  schematyStylow,
  tloWerdyktu,
  walidujStyle,
  zmienneStylu,
  type PoziomWerdyktu,
  type StylWygladu,
} from "../style"

// WCAG 2.x AA: text 4.5:1 (1.4.3), non-text UI parts such as borders and icons 3:1 (1.4.11).
const TEKST = 4.5
const NIE_TEKST = 3

const STYLE: readonly StylWygladu[] = STYLE_WYGLADU
const POZIOMY: { poziom: PoziomWerdyktu; tekst: "okTekst" | "uwagaTekst" | "bladTekst" }[] = [
  { poziom: "ok", tekst: "okTekst" },
  { poziom: "uwaga", tekst: "uwagaTekst" },
  { poziom: "blad", tekst: "bladTekst" },
]

describe("colour maths (WCAG 2.x)", () => {
  it("black on white is 21:1 and a colour on itself 1:1", () => {
    expect(kontrast("#000000", "#FFFFFF")).toBeCloseTo(21, 5)
    expect(kontrast("#FFFFFF", "#000000")).toBeCloseTo(21, 5)
    expect(kontrast("#777777", "#777777")).toBe(1)
  })

  it("luminance of mid grey #777777 matches the WCAG formula", () => {
    // 0x77 = 119 → 119/255 = 0.4667 → ((0.4667+0.055)/1.055)^2.4 = 0.1845
    expect(luminancja("#777777")).toBeCloseTo(0.1845, 3)
  })

  it("mixes per channel in sRGB", () => {
    expect(zmieszaj("#FFFFFF", "#000000", 0.5)).toBe("#808080")
    expect(zmieszaj("#FF0000", "#0000FF", 0)).toBe("#0000FF")
    expect(zmieszaj("#FF0000", "#0000FF", 1)).toBe("#FF0000")
  })
})

describe("style table (D63–D67)", () => {
  it("is structurally valid", () => {
    expect(walidujStyle(STYLE)).toEqual([])
  })

  it("validation reports a broken entry", () => {
    const zly: StylWygladu = {
      ...STYLE[0],
      id: "Zly Id",
      tokeny: { ...STYLE[0].tokeny, tlo: "black" },
      werdykty: { ...STYLE[0].werdykty, udzialTla: 0.9 },
    }
    const problemy = walidujStyle([STYLE[0], zly, STYLE[0]])
    expect(problemy.some((p) => p.includes("kebab-case"))).toBe(true)
    expect(problemy.some((p) => p.includes("tokeny.tlo"))).toBe(true)
    expect(problemy.some((p) => p.includes("udzialTla"))).toBe(true)
    expect(problemy.some((p) => p.includes("duplicate"))).toBe(true)
  })

  it("first batch (D67 next step 4) is in the table, in the D67 groups", () => {
    const grupa = Object.fromEntries(STYLE.map((s) => [s.id, s.grupa]))
    expect(grupa).toEqual({
      "grafit-zloto": "premium",
      "granat-miedz": "premium",
      "jasny-architektoniczny": "jasne",
      rozdzielnica: "jasne",
      "oled-oszczedny": "premium",
    })
  })

  it("styles 1–3 are marked PRO, the rest undecided (D67 addendum)", () => {
    for (const s of STYLE) {
      const pro = ["grafit-zloto", "granat-miedz", "jasny-architektoniczny"].includes(s.id)
      expect(s.dostepnosc, s.id).toBe(pro ? "pro" : "nieustalona")
    }
  })

  it("every group has a translated name and every style a translated name and description", () => {
    const klucze = [...GRUPY_STYLOW.map((g) => g.nazwaKlucz), ...STYLE.flatMap((s) => [s.nazwaKlucz, s.opisKlucz])]
    for (const k of klucze) {
      expect(uiPl[k], `pl ${k}`).toBeTruthy()
      expect(uiEn[k], `en ${k}`).toBeTruthy()
      expect(uiRu[k], `ru ${k}`).toBeTruthy()
    }
  })
})

/**
 * The verdict contrast test every style must pass before it ships (D64/D67). Rule from
 * `docs/opis-ekranow-dla-ai.md` section 7: verdict colours are sacred. Every ratio is computed from
 * the table — the same hex values the generated CSS uses.
 */
describe.each(STYLE.map((s) => [s.id, s] as const))("verdict contrast — %s", (_id, styl) => {
  const { tlo, karta } = styl.tokeny

  it.each(POZIOMY)("$poziom: text ≥ 4.5:1 on the verdict box, the card and the page", ({ poziom, tekst }) => {
    const kolor = styl.werdykty[tekst]
    expect(kontrast(kolor, tloWerdyktu(styl, poziom))).toBeGreaterThanOrEqual(TEKST)
    expect(kontrast(kolor, karta)).toBeGreaterThanOrEqual(TEKST)
    expect(kontrast(kolor, tlo)).toBeGreaterThanOrEqual(TEKST)
  })

  it.each(POZIOMY)("$poziom: border/icon ≥ 3:1 against the card and the page", ({ poziom }) => {
    const kolor = styl.werdykty[poziom]
    expect(kontrast(kolor, karta)).toBeGreaterThanOrEqual(NIE_TEKST)
    expect(kontrast(kolor, tlo)).toBeGreaterThanOrEqual(NIE_TEKST)
  })

  it("the three verdicts are three different colours, none equal to the accent", () => {
    const w = styl.werdykty
    const bazy = [w.ok, w.uwaga, w.blad].map((k) => k.toUpperCase())
    expect(new Set(bazy).size).toBe(3)
    expect(bazy).not.toContain(styl.tokeny.akcent.toUpperCase())
  })
})

describe.each(STYLE.map((s) => [s.id, s] as const))("base token contrast — %s", (_id, styl) => {
  const t = styl.tokeny

  it("text ≥ 4.5:1 on page, card and second surface", () => {
    for (const tlo of [t.tlo, t.karta, t.karta2]) expect(kontrast(t.tekst, tlo)).toBeGreaterThanOrEqual(TEKST)
  })

  it("secondary text ≥ 4.5:1 on the card", () => {
    expect(kontrast(t.tekstPrzygaszony, t.karta)).toBeGreaterThanOrEqual(TEKST)
  })

  it("text on the accent ≥ 4.5:1, accent ≥ 4.5:1 on the card (link text) and ≥ 3:1 on the page", () => {
    expect(kontrast(t.akcentTekst, t.akcent)).toBeGreaterThanOrEqual(TEKST)
    expect(kontrast(t.akcent, t.karta)).toBeGreaterThanOrEqual(TEKST)
    expect(kontrast(t.akcent, t.tlo)).toBeGreaterThanOrEqual(NIE_TEKST)
  })

  it("field borders ≥ 3:1 on page, card and second surface (WCAG 1.4.11)", () => {
    for (const tlo of [t.tlo, t.karta, t.karta2]) expect(kontrast(t.obrys, tlo)).toBeGreaterThanOrEqual(NIE_TEKST)
  })
})

describe("generated CSS", () => {
  const css = generujCssStylow()

  it("has one rule per style with its scheme, tokens and verdict backgrounds", () => {
    for (const s of STYLE) {
      const regula = css.split("\n").find((l) => l.startsWith(`html:root[data-styl="${s.id}"]{`))
      expect(regula, s.id).toBeDefined()
      expect(regula).toContain(`color-scheme:${s.schemat === "ciemny" ? "dark" : "light"};`)
      expect(regula).toContain(`--background:${s.tokeny.tlo};`)
      expect(regula).toContain(`--werdykt-blad-bg:${tloWerdyktu(s, "blad")};`)
      expect(regula).toContain(`--werdykt-ok-foreground:${s.werdykty.okTekst};`)
    }
  })

  it("sets every verdict and surface token the default theme defines, so nothing leaks from light/dark", () => {
    const wymagane = [
      "--background", "--foreground", "--card", "--card-foreground", "--popover", "--popover-foreground",
      "--primary", "--primary-foreground", "--secondary", "--muted", "--muted-foreground", "--accent",
      "--border", "--input", "--ring", "--destructive",
      ...(["ok", "uwaga", "blad"] as const).flatMap((p) => ["", "-bg", "-border", "-foreground"].map((x) => `--werdykt-${p}${x}`)),
    ]
    for (const s of STYLE) expect(Object.keys(zmienneStylu(s))).toEqual(expect.arrayContaining(wymagane))
  })

  it("maps every style to the light/dark class it forces", () => {
    expect(schematyStylow()).toEqual(
      Object.fromEntries(STYLE.map((s) => [s.id, s.schemat === "ciemny" ? "dark" : "light"])),
    )
  })
})
