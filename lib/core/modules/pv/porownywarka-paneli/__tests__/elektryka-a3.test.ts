import { describe, expect, it } from "vitest"
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"
import { KATALOG_PANELI_PV, znajdzPanelKatalogu } from "@/lib/core/dane/katalog-paneli-pv"
import { calculatePorownywarkaPaneli } from "../calculator"
import { ocenElektryke } from "../elektryka"
import type { DanePanelu, PorownywarkaInput } from "../input"
import { domyslnyWyborKryteriow } from "../kryteria"

/**
 * Referencje ręczne dla JA Solar JAM60D41-500/LB (karta: Voc 43,85 V, Vmp 36,91 V, Isc 14,42 A, Imp 13,55 A, β(Voc) −0,25 %/°C,
 * 1500 V DC, bezpiecznik szeregowy 30 A) przy Tmin = −20 °C:
 *   Voc_zima = 43,85·(1 + 0,0025·45) = 48,7831 V; maks. w szeregu = ⌊1500/48,7831⌋ = 30;
 *   I_SC_MAX = 1,25·14,42 = 18,025 A; przedział zabezpieczenia 1,1·18,025 = 19,8275 … 30 A;
 *   obowiązek zabezpieczenia (Ns > 2): 1,35·30 = 40,5 < (Ns−1)·18,025  ⇒  Ns = 3: 36,05 → nie (alternatywa kablowa); Ns = 4: 54,075 → tak.
 */
const zKatalogu = (id: string): DanePanelu => ({ ...znajdzPanelKatalogu(id)!, cenaBruttoZl: null })
const ja500 = (): DanePanelu => zKatalogu("ja-solar-jam60d41-lb-500")

describe("ocenElektryke (A3)", () => {
  it("12 paneli JA 500 W przy −20 °C: napięcie zimą, limit w szeregu i warianty z ochroną stringów", () => {
    const w = ocenElektryke(ja500(), 12, -20)!
    expect(w.vocZimaPanelaV).toBeCloseTo(48.7831, 4)
    expect(w.maxPaneliWSzeregu).toBe(30)
    expect(w.iscMaxStringuA).toBeCloseTo(18.025, 6)
    // divisors of 12 within the limit, ordered from the fewest parallel strings
    expect(w.warianty.map((v) => [v.panelowWSzeregu, v.stringowRownolegle])).toEqual([[12, 1], [6, 2], [4, 3], [3, 4], [2, 6], [1, 12]])
    const [s12, s6, s4, s3, , s1] = w.warianty
    expect(s12!.vocZimaStringuV).toBeCloseTo(12 * 48.7831, 3)
    expect(s12!.vmpStringuV).toBeCloseTo(12 * 36.91, 6)
    expect(s6!.impMacierzyA).toBeCloseTo(2 * 13.55, 6)
    expect(s6!.iscMacierzyA).toBeCloseTo(2 * 14.42, 6)
    expect(s12!.ochrona).toMatchObject({ wymagana: false, alternatywaKablowa: false, zakresPoprawny: true })
    expect(s6!.ochrona).toMatchObject({ wymagana: false, alternatywaKablowa: false })
    expect(s4!.ochrona).toMatchObject({ wymagana: false, alternatywaKablowa: true })
    expect(s3!.ochrona).toMatchObject({ wymagana: true, alternatywaKablowa: false })
    expect(s1!.ochrona!.inMinA).toBeCloseTo(19.8275, 4)
    expect(s1!.ochrona!.inMaxA).toBe(30)
  })

  it("liczba pierwsza paneli: tylko jeden string albo same równoległe", () => {
    const w = ocenElektryke(ja500(), 7, -20)!
    expect(w.warianty.map((v) => [v.panelowWSzeregu, v.stringowRownolegle])).toEqual([[7, 1], [1, 7]])
  })

  it("limit napięcia z karty ogranicza długość stringu (Trina 475 W, Voc 55,0 V, β −0,24 %/°C, −40 °C: 1500 V)", () => {
    const trina = zKatalogu("trina-vertex-s-plus-neg9r28-475")
    const w = ocenElektryke(trina, 40, -40)!
    // Voc_zima = 55,0·(1 + 0,0024·65) = 63,58 V; ⌊1500/63,58⌋ = 23
    expect(w.vocZimaPanelaV).toBeCloseTo(63.58, 6)
    expect(w.maxPaneliWSzeregu).toBe(23)
    // divisors of 40 not above 23: 1, 2, 4, 5, 8, 10, 20
    expect(w.warianty.map((v) => v.panelowWSzeregu)).toEqual([20, 10, 8, 5, 4, 2, 1])
    expect(Math.max(...w.warianty.map((v) => v.vocZimaStringuV))).toBeLessThanOrEqual(1500)
  })

  it("brak danych elektrycznych, Tmin albo liczby sztuk → null (bez zgadywania)", () => {
    expect(ocenElektryke({ ...ja500(), elektryka: null }, 12, -20)).toBeNull()
    expect(ocenElektryke(ja500(), 12, null)).toBeNull()
    expect(ocenElektryke(ja500(), 12, undefined)).toBeNull()
    expect(ocenElektryke(ja500(), 0, -20)).toBeNull()
  })

  it("karta bez prądu bezpiecznika szeregowego (Jinko 66HL4M 590 W, edycja EN) → ochrona null, napięcia policzone", () => {
    const j = zKatalogu("jinko-tiger-neo-66hl4m-bdv-590")
    expect(j.elektryka!.maxBezpiecznikSzeregowyA).toBeNull()
    const w = ocenElektryke(j, 6, -20)!
    expect(w.warianty.every((v) => v.ochrona === null)).toBe(true)
    expect(w.warianty[0]!.vocZimaStringuV).toBeGreaterThan(0)
  })
})

describe("dane elektryczne katalogu (A3)", () => {
  it("każdy wpis ma komplet danych elektrycznych, a liczby są spójne: Vmp·Imp ≈ Pmax (±2%), Voc > Vmp, Isc > Imp, β < 0", () => {
    for (const p of KATALOG_PANELI_PV) {
      const e = p.elektryka
      expect(e, p.id).toBeTruthy()
      expect(e!.vmpV * e!.impA / p.pmaxW, p.id).toBeGreaterThan(0.98)
      expect(e!.vmpV * e!.impA / p.pmaxW, p.id).toBeLessThan(1.02)
      expect(e!.vocV, p.id).toBeGreaterThan(e!.vmpV)
      expect(e!.iscA, p.id).toBeGreaterThan(e!.impA)
      expect(e!.betaVocPctNaC, p.id).toBeLessThan(0)
      expect(e!.maxNapieciaSystemuV, p.id).toBe(1500)
    }
  })

  it("wartości zgodne z transkrypcjami kart (próbki: JA 500 W, Trina 475 W, LONGi 60HVH 560 W, Hyundai 520 W)", () => {
    expect(znajdzPanelKatalogu("ja-solar-jam60d41-lb-500")!.elektryka).toEqual({ vocV: 43.85, vmpV: 36.91, iscA: 14.42, impA: 13.55, betaVocPctNaC: -0.25, maxNapieciaSystemuV: 1500, maxBezpiecznikSzeregowyA: 30 })
    expect(znajdzPanelKatalogu("trina-vertex-s-plus-neg9r28-475")!.elektryka).toMatchObject({ vocV: 55.0, vmpV: 46.4, iscA: 10.93, impA: 10.24, betaVocPctNaC: -0.24, maxBezpiecznikSzeregowyA: 25 })
    expect(znajdzPanelKatalogu("longi-himo-x10-lr7-60hvh-560")!.elektryka).toMatchObject({ vocV: 45.28, vmpV: 37.51, iscA: 15.65, impA: 14.93, betaVocPctNaC: -0.2, maxBezpiecznikSzeregowyA: 25 })
    expect(znajdzPanelKatalogu("hyundai-hit-h5xxcf-bf-zb-520")!.elektryka).toMatchObject({ vocV: 40.96, vmpV: 35.56, iscA: 15.42, impA: 14.67, betaVocPctNaC: -0.22, maxBezpiecznikSzeregowyA: 30 })
  })
})

describe("calculatePorownywarkaPaneli — elektryka i masa (A3)", () => {
  const rok = (): RekordGodzinowy[] => {
    const start = Date.UTC(2018, 0, 1)
    return Array.from({ length: 8760 }, (_, h) => {
      const czasUtcMs = start + h * 3_600_000
      const m = new Date(czasUtcMs).getUTCMonth()
      const g = m === 0 ? 200 : m === 6 ? 600 : 0
      return { czasUtcMs, ghi: g, dni: 0, dhi: g, tempC: m === 0 ? -5 : 20 }
    })
  }
  const wejscie = (panele: DanePanelu[], tminC?: number | null): PorownywarkaInput => ({
    szerokoscGeograficzna: 52.2,
    dlugoscGeograficzna: 21,
    daneGodzinowe: rok(),
    miejsce: { nachylenieDeg: 0, azymutDeg: 180, albedo: 0.2 },
    liczbaPaneli: 12,
    panele,
    wycena: null,
    kryteria: domyslnyWyborKryteriow(),
    ...(tminC !== undefined ? { tminC } : {}),
  })

  it("z najniższą temperaturą: wynik panelu niesie elektrykę dla liczby sztuk; masa na m² z karty (27,3 kg / 1,953·1,134 m²)", () => {
    const r = calculatePorownywarkaPaneli(wejscie([ja500()], -20))
    const w = r.value.panele[0]!
    expect(w.elektryka!.warianty.length).toBe(6)
    expect(w.elektryka!.vocZimaPanelaV).toBeCloseTo(48.7831, 4)
    expect(w.masaNaM2Kg).toBeCloseTo(27.3 / (1.953 * 1.134), 6)
    expect(r.warnings.map((x) => x.code)).not.toContain("PORP-ELEKTRYKA-BRAK-TMIN")
  })

  it("bez najniższej temperatury: elektryka null i informacja z kodem; panel bez danych elektrycznych — osobna informacja", () => {
    const r = calculatePorownywarkaPaneli(wejscie([ja500(), { ...ja500(), id: "bez", nazwa: "Bez elektryki", elektryka: null }]))
    expect(r.value.panele.every((p) => p.elektryka === null)).toBe(true)
    const kody = r.warnings.map((x) => x.code)
    expect(kody).toContain("PORP-ELEKTRYKA-BRAK-TMIN")
    expect(kody).toContain("PORP-ELEKTRYKA-BRAK-DANYCH")
  })

  it("dane elektryczne wpisane ręcznie dają taki sam wynik jak z katalogu, a niespójne Vmp × Imp daje ostrzeżenie", () => {
    const zKarty = ja500()
    const reczny: DanePanelu = { ...zKarty, id: "reczny", nazwa: "Wpisany ręcznie", elektryka: { ...zKarty.elektryka! } }
    const wynik = calculatePorownywarkaPaneli(wejscie([zKarty, reczny], -20))
    expect(wynik.value.panele[1]!.elektryka!.vocZimaPanelaV).toBeCloseTo(wynik.value.panele[0]!.elektryka!.vocZimaPanelaV, 9)
    // 36,91 V × 13,55 A = 500,1 W ≈ 500 W: zgodne, bez ostrzeżenia
    expect(wynik.warnings.map((x) => x.code)).not.toContain("PORP-ELEKTRYKA-NIESPOJNA")
    // literówka: Imp 15,55 A zamiast 13,55 A → Vmp × Imp = 574 W przy 500 W
    const zLiterowka: DanePanelu = { ...reczny, elektryka: { ...reczny.elektryka!, impA: 15.55 } }
    const w2 = calculatePorownywarkaPaneli(wejscie([zLiterowka], -20))
    expect(w2.warnings.filter((x) => x.code === "PORP-ELEKTRYKA-NIESPOJNA")).toHaveLength(1)
  })

  it("najniższa temperatura poza zakresem → INVALID_INPUT", () => {
    const r = calculatePorownywarkaPaneli(wejscie([ja500()], -150))
    expect(r.status).toBe("INVALID_INPUT")
    expect(r.warnings.map((x) => x.code)).toContain("PORP-TMIN-POZA-ZAKRESEM")
  })
})
