import { readFileSync } from "node:fs"
import path from "node:path"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { StanBledu } from "@/components/ui/stany"
import { WerdyktBadge, WerdyktPanel } from "@/components/werdykt"
import { uiEn, uiPl, uiRu } from "@/lib/i18n/ui"
import { kontrast, luminancja, zmieszaj } from "../kolor"
import {
  GRUPY_STYLOW,
  SELEKTOR_KARTY,
  STYLE_WYGLADU,
  cssEfektow,
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

  it("all 27 styles of D67 are in the table, in the D67 groups and in the D67 order", () => {
    const wGrupach = Object.fromEntries(GRUPY_STYLOW.map((g) => [g.id, STYLE.filter((s) => s.grupa === g.id).map((s) => s.id)]))
    expect(wGrupach).toEqual({
      premium: [
        "grafit-zloto", "granat-miedz", "tytan", "las-mosiadz", "kreslarski", "noc-polarna", "rozowe-zloto",
        "pomarancz-sygnalowy", "zachod-slonca", "oled-oszczedny",
      ],
      jasne: ["jasny-architektoniczny", "pudrowy-roz", "sloneczny-poranek", "rozdzielnica", "e-ink", "marmur-zloto", "zen"],
      eksperymentalne: [
        "holograficzny", "kokpit-hud", "szklo", "brutalizm", "orbita", "neumorfizm", "notatnik-inzyniera", "plynny-gradient",
      ],
      ukryte: ["synthwave", "terminal-dos"],
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
/**
 * Every opaque colour of the page: the page token plus the areas a decoration paints (gradient
 * stops, glows — `efekty.tlo.kolory`). Text and borders that sit straight on the page are tested
 * against all of them.
 */
function koloryStrony(styl: StylWygladu): string[] {
  const e = styl.efekty
  return [styl.tokeny.tlo, ...(e?.tlo?.kolory ?? []), ...(e?.tloRuchome?.kolory ?? [])]
}

/** Card surfaces: the opaque card token and, for glass styles, the glass over every page colour. */
function koloryKart(styl: StylWygladu): string[] {
  const szklo = styl.efekty?.karta?.szklo
  const nadStrona = szklo ? koloryStrony(styl).map((k) => zmieszaj(szklo.kolor, k, szklo.krycie)) : []
  return [styl.tokeny.karta, ...nadStrona]
}

describe.each(STYLE.map((s) => [s.id, s] as const))("verdict contrast — %s", (_id, styl) => {
  const { tlo, karta } = styl.tokeny

  it.each(POZIOMY)("$poziom: text ≥ 4.5:1 on the verdict box, the card and the page", ({ poziom, tekst }) => {
    const kolor = styl.werdykty[tekst]
    expect(kontrast(kolor, tloWerdyktu(styl, poziom))).toBeGreaterThanOrEqual(TEKST)
    expect(kontrast(kolor, karta)).toBeGreaterThanOrEqual(TEKST)
    expect(kontrast(kolor, tlo)).toBeGreaterThanOrEqual(TEKST)
  })

  it.each(POZIOMY)("$poziom: border/icon ≥ 3:1 against the card and the page (with its decoration)", ({ poziom }) => {
    const kolor = styl.werdykty[poziom]
    for (const pod of [...koloryKart(styl), ...koloryStrony(styl)]) expect(kontrast(kolor, pod), pod).toBeGreaterThanOrEqual(NIE_TEKST)
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

  const strona = koloryStrony(styl)
  const karty = koloryKart(styl)

  it("text ≥ 4.5:1 on page (with its decoration), cards and second surface", () => {
    for (const tlo of [...strona, ...karty, t.karta2]) expect(kontrast(t.tekst, tlo), tlo).toBeGreaterThanOrEqual(TEKST)
  })

  it("secondary text ≥ 4.5:1 on the cards and on a decorated page", () => {
    const podloza = styl.efekty?.tlo || styl.efekty?.tloRuchome ? [...karty, ...strona] : karty
    for (const tlo of podloza) expect(kontrast(t.tekstPrzygaszony, tlo), tlo).toBeGreaterThanOrEqual(TEKST)
  })

  it("text on the accent ≥ 4.5:1, accent ≥ 4.5:1 on the card (link text) and ≥ 3:1 on the page", () => {
    expect(kontrast(t.akcentTekst, t.akcent)).toBeGreaterThanOrEqual(TEKST)
    for (const tlo of karty) expect(kontrast(t.akcent, tlo), tlo).toBeGreaterThanOrEqual(TEKST)
    for (const tlo of strona) expect(kontrast(t.akcent, tlo), tlo).toBeGreaterThanOrEqual(NIE_TEKST)
  })

  it("field borders ≥ 3:1 on page, cards and second surface (WCAG 1.4.11)", () => {
    for (const tlo of [...strona, ...karty, t.karta2]) expect(kontrast(t.obrys, tlo), tlo).toBeGreaterThanOrEqual(NIE_TEKST)
  })

  it("focus ring ≥ 3:1 on page and cards", () => {
    const pierscien = t.pierscien ?? t.akcent
    for (const tlo of [...strona, ...karty]) expect(kontrast(pierscien, tlo), tlo).toBeGreaterThanOrEqual(NIE_TEKST)
  })

  it("a recoloured result number stays ≥ 4.5:1 on every verdict box and card", () => {
    const kolor = styl.warianty.wynik?.kolor
    if (!kolor) return
    for (const { poziom } of POZIOMY) expect(kontrast(kolor, tloWerdyktu(styl, poziom)), poziom).toBeGreaterThanOrEqual(TEKST)
    for (const tlo of karty) expect(kontrast(kolor, tlo)).toBeGreaterThanOrEqual(TEKST)
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

// ---------------------------------------------------------------------------------------------
// Colour-vision simulation (D65 Pomarańcz sygnałowy, D66 Kokpit HUD). Machado, Oliveira & Fernandes
// (2009), severity 1.0, applied to linear sRGB; distance = CIEDE2000 (Sharma, Wu & Dalal 2005).
// Test-only code: it lives here because every file under `__tests__/` is collected as a test suite.

type Widzenie = "trichromat" | "deuteranopia" | "protanopia"
const MACHADO: Record<Exclude<Widzenie, "trichromat">, number[][]> = {
  protanopia: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deuteranopia: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
}

function liniowe(hex: string): number[] {
  return [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
}

function symuluj(hex: string, w: Widzenie): number[] {
  const l = liniowe(hex)
  if (w === "trichromat") return l
  return MACHADO[w].map((r) => Math.min(1, Math.max(0, r[0] * l[0] + r[1] * l[1] + r[2] * l[2])))
}

/** Linear sRGB → CIELAB (D65 white). */
function lab([r, g, b]: number[]): [number, number, number] {
  const x = (0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047
  const y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b
  const z = (0.0193339 * r + 0.119192 * g + 0.9503041 * b) / 1.08883
  const f = (t: number) => (t > 216 / 24389 ? Math.cbrt(t) : ((24389 / 27) * t + 16) / 116)
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))]
}

function deltaE2000([L1, a1, b1]: number[], [L2, a2, b2]: number[]): number {
  const st = Math.PI / 180
  const Cs = (Math.hypot(a1, b1) + Math.hypot(a2, b2)) / 2
  const G = 0.5 * (1 - Math.sqrt(Cs ** 7 / (Cs ** 7 + 25 ** 7)))
  const a1p = (1 + G) * a1
  const a2p = (1 + G) * a2
  const C1 = Math.hypot(a1p, b1)
  const C2 = Math.hypot(a2p, b2)
  const kat = (x: number, y: number) => (x === 0 && y === 0 ? 0 : (Math.atan2(y, x) / st + 360) % 360)
  const h1 = kat(a1p, b1)
  const h2 = kat(a2p, b2)
  let dh = 0
  if (C1 * C2 !== 0) dh = h2 - h1 > 180 ? h2 - h1 - 360 : h2 - h1 < -180 ? h2 - h1 + 360 : h2 - h1
  const dH = 2 * Math.sqrt(C1 * C2) * Math.sin((dh / 2) * st)
  const Lm = (L1 + L2) / 2
  const Cm = (C1 + C2) / 2
  let hm = h1 + h2
  if (C1 * C2 !== 0) hm = Math.abs(h1 - h2) > 180 ? (h1 + h2 < 360 ? (hm + 360) / 2 : (hm - 360) / 2) : hm / 2
  const T =
    1 -
    0.17 * Math.cos((hm - 30) * st) +
    0.24 * Math.cos(2 * hm * st) +
    0.32 * Math.cos((3 * hm + 6) * st) -
    0.2 * Math.cos((4 * hm - 63) * st)
  const SL = 1 + (0.015 * (Lm - 50) ** 2) / Math.sqrt(20 + (Lm - 50) ** 2)
  const SC = 1 + 0.045 * Cm
  const SH = 1 + 0.015 * Cm * T
  const RT = -Math.sin(2 * 30 * Math.exp(-(((hm - 275) / 25) ** 2)) * st) * 2 * Math.sqrt(Cm ** 7 / (Cm ** 7 + 25 ** 7))
  const dL = (L2 - L1) / SL
  const dC = (C2 - C1) / SC
  const dHs = dH / SH
  return Math.sqrt(dL ** 2 + dC ** 2 + dHs ** 2 + RT * dC * dHs)
}

const roznica = (a: string, b: string, w: Widzenie) => deltaE2000(lab(symuluj(a, w)), lab(symuluj(b, w)))

describe("colour-vision maths", () => {
  it("CIEDE2000 matches the Sharma et al. reference pairs", () => {
    expect(deltaE2000([50, 2.6772, -79.7751], [50, 0, -82.7485])).toBeCloseTo(2.0425, 4)
    expect(deltaE2000([50, 2.5, 0], [56, -27, -3])).toBeCloseTo(31.903, 3)
  })

  it("simulation keeps grey grey and merges red with green for deuteranopia", () => {
    const szary = symuluj("#808080", "deuteranopia")
    expect(Math.max(...szary) - Math.min(...szary)).toBeLessThan(0.01)
    expect(roznica("#EF4444", "#22C55E", "deuteranopia")).toBeLessThan(roznica("#EF4444", "#22C55E", "trichromat") / 5)
  })
})

/**
 * D65/D66: the accent must not be easier to confuse with a verdict colour than the verdict colours
 * already are with each other. Bar per vision type = the smallest ΔE00 between the style's own
 * 🟢/🟡/🔴 for deuteranopia and protanopia (for normal vision: the smaller of the two); the accent
 * is compared with every verdict base and text colour. For a colour-blind user the icon and the
 * label carry the verdict anyway (D65, tested below).
 */
describe.each(["pomarancz-sygnalowy", "kokpit-hud"])("colour-vision test — %s", (id) => {
  const s = STYLE.find((x) => x.id === id)!
  const w = s.werdykty
  const prog = (wid: Widzenie) =>
    Math.min(roznica(w.ok, w.uwaga, wid), roznica(w.uwaga, w.blad, wid), roznica(w.ok, w.blad, wid))
  const progCvd = Math.min(prog("deuteranopia"), prog("protanopia"))

  it.each(["trichromat", "deuteranopia", "protanopia"] as const)("%s: accent vs every verdict colour", (wid) => {
    const bar = wid === "trichromat" ? progCvd : prog(wid)
    for (const v of [w.ok, w.uwaga, w.blad, w.okTekst, w.uwagaTekst, w.bladTekst])
      expect(roznica(s.tokeny.akcent, v, wid), `${s.tokeny.akcent} vs ${v}`).toBeGreaterThanOrEqual(bar)
  })

  it("turquoise/orange accent vs 🟢 for deuteranopia is further apart than 🟢 vs 🔴", () => {
    expect(roznica(s.tokeny.akcent, w.ok, "deuteranopia")).toBeGreaterThan(roznica(w.ok, w.blad, "deuteranopia"))
  })
})

describe("why 🟡 of Pomarańcz sygnałowy was lightened", () => {
  it("prototype #FF6B1A vs prototype 🟡 #F59E0B is closer for deuteranopia than 🟢 vs 🔴", () => {
    expect(roznica("#FF6B1A", "#F59E0B", "deuteranopia")).toBeLessThan(roznica("#22C55E", "#EF4444", "deuteranopia"))
  })
})

// ---------------------------------------------------------------------------------------------
// Conditions of D65–D67 on the generated CSS and the components.

const CSS = generujCssStylow()
const styl = (id: string) => STYLE.find((s) => s.id === id)!
const KATALOG = path.resolve(__dirname, "../../..")
const plik = (p: string) => readFileSync(path.join(KATALOG, p), "utf8")

/** Lines of a stylesheet with their wrapping at-rule ("" for a plain rule). */
function bloki(css: string): { otoczka: string; tresc: string }[] {
  return css.split("\n").map((linia) => {
    const m = /^(@media[^{]*|@supports[^{]*)\{(.*)\}$/.exec(linia)
    return m ? { otoczka: m[1].trim(), tresc: m[2] } : { otoczka: "", tresc: linia }
  })
}

describe("conditions of D65–D67", () => {
  it("every animation runs only under prefers-reduced-motion: no-preference (D66, opis-ekranow 7.5)", () => {
    const zAnimacja = bloki(CSS).filter((b) => /animation:/.test(b.tresc))
    expect(zAnimacja.length).toBeGreaterThan(0)
    for (const b of zAnimacja) expect(b.otoczka).toBe("@media (prefers-reduced-motion:no-preference)")
  })

  it("Holograficzny: rainbow only on opt-in cards, never on a verdict or warning box (D66)", () => {
    const tecza = styl("holograficzny").efekty!.karta!.teczowa!.kolory
    const zTecza = bloki(CSS).filter((b) => tecza.some((k) => b.tresc.includes(k)))
    expect(zTecza.length).toBe(1)
    expect(zTecza[0].tresc.startsWith(`html:root[data-styl="holograficzny"] ${SELEKTOR_KARTY}{`)).toBe(true)
    expect(cssEfektow(styl("holograficzny")).some((r) => r.includes("animation:"))).toBe(true)
  })

  it("Synthwave: neon pink only in the page background rule (D66)", () => {
    const zNeonem = bloki(CSS).filter((b) => b.tresc.includes("255,62,165"))
    expect(zNeonem.length).toBe(1)
    expect(zNeonem[0].tresc.startsWith('html:root[data-styl="synthwave"] body{')).toBe(true)
    const s = styl("synthwave")
    for (const k of [...Object.values(s.tokeny), ...Object.values(s.werdykty)]) expect(String(k).toUpperCase()).not.toBe("#FF3EA5")
  })

  it("card effects exclude role=status/alert; verdict and warning boxes carry those roles and no card hook", () => {
    expect(SELEKTOR_KARTY).toContain(':not([role="status"],[role="alert"])')
    const html = [
      renderToStaticMarkup(createElement(WerdyktPanel, { poziom: "uwaga" })),
      renderToStaticMarkup(createElement(StanBledu, { tytul: "x" })),
    ]
    for (const h of html) {
      expect(h).toMatch(/^<div role="(status|alert)"/)
      expect(h).not.toContain("data-karta")
      expect(h).not.toContain("bg-card")
    }
  })

  it("Pomarańcz sygnałowy (D65): verdicts with icon and label, neutral ring, orange only on edge, buttons and nav", () => {
    for (const poziom of ["ok", "uwaga", "blad"] as const) {
      for (const h of [
        renderToStaticMarkup(createElement(WerdyktPanel, { poziom })),
        renderToStaticMarkup(createElement(WerdyktBadge, { poziom })),
      ]) {
        // The verdict is an SVG sign (tick / triangle / cross: shape, not colour alone) plus a text label.
        expect(h).toMatch(/<svg[^>]*aria-hidden="true"/)
        expect(h.replace(/<[^>]+>/gu, "").trim().length).toBeGreaterThan(0)
      }
    }
    const p = styl("pomarancz-sygnalowy")
    const zm = zmienneStylu(p)
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(zm["--ring"].slice(i, i + 2), 16))
    expect(Math.max(r, g, b) - Math.min(r, g, b)).toBeLessThanOrEqual(12) // a neutral grey
    const pomaranczowe = Object.entries(zm)
      .filter(([, v]) => v === p.tokeny.akcent)
      .map(([k]) => k)
    expect(pomaranczowe.sort()).toEqual(["--primary", "--sidebar-primary"])
    expect(cssEfektow(p)).toEqual([
      `html:root[data-styl="pomarancz-sygnalowy"] ${SELEKTOR_KARTY}{border-left:3px solid var(--primary)}`,
    ])
  })

  it("Szkło and Płynny gradient: blur only with support, off for reduced transparency and weak devices (D66)", () => {
    for (const id of ["szklo", "plynny-gradient"]) {
      const reguly = bloki(cssEfektow(styl(id)).join("\n"))
      const zBlur = reguly.filter((b) => /backdrop-filter:blur/.test(b.tresc))
      expect(zBlur.length, id).toBe(1)
      expect(zBlur[0].otoczka.startsWith("@supports")).toBe(true)
      expect(zBlur[0].tresc).toContain(":not([data-bez-rozmycia])")
      const bezPrzezroczystosci = reguly.find((b) => b.otoczka === "@media (prefers-reduced-transparency:reduce)")
      expect(bezPrzezroczystosci?.tresc).toContain("backdrop-filter:none")
      expect(reguly.some((b) => b.otoczka === "" && b.tresc.includes("background-color:var(--card)"))).toBe(true)
    }
    expect(plik("app/layout.tsx")).toContain("setAttribute('data-bez-rozmycia'")
  })

  it("Płynny gradient: the background moves only on the dashboard (D67)", () => {
    const ruch = bloki(CSS).filter((b) => b.tresc.includes("animation:styl-plynny-gradient"))
    expect(ruch.length).toBe(1)
    expect(ruch[0].tresc).toContain('html:root[data-styl="plynny-gradient"]:has([data-pulpit]) body{')
    expect(plik("app/page.tsx").match(/data-pulpit/g)?.length).toBe(2) // the comment and the attribute
  })

  it("Notatnik inżyniera: handwriting only for headings and the result, table numbers in the sans font (D67)", () => {
    const zm = zmienneStylu(styl("notatnik-inzyniera"))
    expect(zm["--font-naglowek"]).toContain("--font-caveat")
    expect(zm["--font-wynik"]).toContain("--font-caveat")
    expect(zm["--font-liczby"]).toBe("var(--font-sans-user)")
    expect(zm["--font-tekst"]).toBeUndefined()
    for (const s of STYLE) if (s.id !== "notatnik-inzyniera") expect(JSON.stringify(zmienneStylu(s)), s.id).not.toContain("caveat")
  })

  it("Terminal DOS: result white, never the 🟡 yellow; 🔴 readable on the blue (D67)", () => {
    const dos = styl("terminal-dos")
    expect(dos.warianty.wynik?.kolor).toBe("#FFFFFF")
    expect([dos.werdykty.uwaga, dos.werdykty.uwagaTekst]).not.toContain(dos.warianty.wynik?.kolor)
    expect(kontrast(dos.werdykty.bladTekst, dos.tokeny.tlo)).toBeGreaterThanOrEqual(TEKST)
    expect(kontrast(dos.werdykty.blad, dos.tokeny.tlo)).toBeGreaterThanOrEqual(NIE_TEKST)
  })

  it("the result hook exists: WynikGlowny carries .wynik-glowny and globals.css reads the style variables", () => {
    expect(plik("components/wzorce/wynik-glowny.tsx")).toContain('className="wynik-glowny ')
    const css = plik("app/globals.css")
    expect(css).toContain("var(--font-wynik, inherit)")
    expect(css).toContain("var(--kolor-wyniku, inherit)")
    expect(css).toContain("var(--font-tekst, var(--font-sans))")
  })

  it("style fonts load through next/font with Cyrillic and without preload", () => {
    const layout = plik("app/layout.tsx")
    for (const font of ["Caveat", "Source_Serif_4", "JetBrains_Mono"]) {
      const wywolanie = new RegExp(`= ${font}\\(\\{([^}]*)\\}\\)`).exec(layout)
      expect(wywolanie, font).not.toBeNull()
      expect(wywolanie![1]).toContain("'cyrillic'")
      expect(wywolanie![1]).toContain("preload: false")
    }
  })
})
