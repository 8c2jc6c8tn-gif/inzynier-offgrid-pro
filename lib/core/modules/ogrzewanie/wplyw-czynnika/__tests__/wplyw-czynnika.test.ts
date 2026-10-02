import { describe, expect, it } from "vitest"
import { WSPOLCZYNNIK_KWH_NA_L_K } from "../../../zapotrzebowanie/bojler-cwu/constants"
import { calculateWplywCzynnika, type Wiersz } from "../calculator"
import type { Czynnik, WplywCzynnikaInput } from "../input"

const licz = (czynnik: Czynnik, pola: WplywCzynnikaInput["pola"]) => calculateWplywCzynnika({ czynnik, pola })
const wiersz = (wiersze: Wiersz[], klucz: string) => wiersze.find((x) => x.klucz === klucz)?.params

describe("wpływ czynnika — status", () => {
  it("bez czynnika i z brakującym polem → INCOMPLETE", () => {
    expect(calculateWplywCzynnika({ czynnik: null, pola: {} }).status).toBe("INCOMPLETE")
    expect(licz("okna", { powierzchniaM2: 10, uPrzed: 1.5 }).status).toBe("INCOMPLETE")
  })

  it("ujemna wartość i g > 1 → INVALID_INPUT; pola innego czynnika nie są sprawdzane", () => {
    expect(licz("okna", { powierzchniaM2: -1 }).warnings[0]?.code).toBe("M6-WARTOSC-UJEMNA")
    expect(licz("zyski-sloneczne", { g: 1.5 }).warnings[0]?.code).toBe("WPC-ULAMEK-POZA-ZAKRESEM")
    expect(licz("okna", { powierzchniaM2: 10, uPrzed: 1.5, uPo: 0.9, dTK: 40, g: 7 }).status).toBe("VALID")
  })
})

describe("czynniki mocy (Sekcja B: wymagana moc pompy)", () => {
  it("5.80 przykład 1: infiltracja 0,8 wym/h → ok. 1,2 kW i pompa o 15% większa przy 8 kW", () => {
    const r = licz("szczelnosc", { kubaturaM3: 112, nPrzed: 0.8, nPo: 0, dTK: 40, zapotrzebowanieKw: 8 })
    expect(r.value.glowny?.params.zmiana).toBeCloseTo(-1.2008, 3)
    expect(wiersz(r.value.wiersze, "WPC-W-ZAPOTRZEBOWANIE-PO")?.pct).toBeCloseTo(-15.01, 1)
  })

  it("5.77: wymiana okien U 1,5 → 0,9 daje −0,8 kW przy A·ΔT = 1333 m²·K; pompa 8 kW ma zapas", () => {
    const r = licz("okna", { powierzchniaM2: 100 / 3, uPrzed: 1.5, uPo: 0.9, dTK: 40, zapotrzebowanieKw: 8, mocPompyKw: 8 })
    expect(r.value.glowny?.params.zmiana).toBeCloseTo(-0.8, 9)
    expect(wiersz(r.value.wiersze, "WPC-W-ZAPAS-POMPY")?.zapas).toBeCloseTo(0.8, 9)
    expect(r.status).toBe("VALID")
  })

  it("5.75 przykład 3: mostki 20 W/K przy ΔT 40 K = 0,8 kW; po eliminacji nadal za mała pompa → 🟡", () => {
    const r = licz("mostki", { hMostkowPrzedWK: 20, hMostkowPoWK: 0, dTK: 40, zapotrzebowanieKw: 9, mocPompyKw: 8 })
    expect(r.value.glowny?.params.zmiana).toBeCloseTo(-0.8, 9)
    expect(r.warnings.map((x) => x.code)).toEqual(["WPC-POMPA-ZA-MALA"])
  })

  it("5.78: dach U 0,25 + 15 cm λ 0,04 → U' = 0,129 (echo Ekranu 10)", () => {
    const r = licz("dach", { powierzchniaM2: 100, uPrzed: 0.25, gruboscCm: 15, lambda: 0.04, dTK: 40 })
    expect(wiersz(r.value.wiersze, "WPC-W-U-PO")?.u).toBeCloseTo(1 / 7.75, 9)
    expect(r.value.glowny?.params.przed).toBeCloseTo(1, 9)
  })

  it("5.76: rekuperacja 85% zmniejsza stratę wentylacyjną o 85%, wentylatory w osobnym wierszu", () => {
    const r = licz("wentylacja", { strumienM3H: 150, etaPrzedPct: 0, etaPoPct: 85, wentylatoryKwhDoba: 0.5, dTK: 40 })
    expect(r.value.glowny?.params.po).toBeCloseTo(r.value.glowny!.params.przed! * 0.15, 9)
    expect(wiersz(r.value.wiersze, "WPC-W-WENTYLATORY")?.kwh).toBe(0.5)
  })

  it("5.83: 3 m zamiast 2,5 m → kubatura +20% (źródło)", () => {
    const r = licz("wysokosc", { powierzchniaPodlogiM2: 100, obwodM: 40, uScian: 0.2, nPrzed: 0.5, hPrzedM: 2.5, hPoM: 3, dTK: 40 })
    expect(wiersz(r.value.wiersze, "WPC-W-KUBATURA")?.pct).toBeCloseTo(20, 9)
    expect(r.value.glowny!.params.zmiana).toBeGreaterThan(0)
  })
})

describe("czynniki energii i COP", () => {
  it("5.73: rury 0,8 → 0,3 kWh/dobę (Ψ 0,25 → 0,09375 W/(m·K), 10 m, 50/10 °C, 8 h)", () => {
    const r = licz("rury", { dlugoscRurM: 10, psiPrzed: 0.25, psiPo: 0.09375, tWodyC: 50, tOtoczeniaC: 10, godzinyH: 8 })
    expect(r.value.glowny?.params.przed).toBeCloseTo(0.8, 9)
    expect(r.value.glowny?.params.po).toBeCloseTo(0.3, 9)
  })

  it("5.81: 1500 kWh zysków w sezonie = 0,5 kW przy 3000 h; założenie o mocy obliczeniowej", () => {
    const r = licz("zyski-sloneczne", { powierzchniaOkienM2: 10, g: 0.5, napromieniowanieKwhM2: 300, godzinySezonuH: 3000 })
    expect(r.value.glowny?.params.kwh).toBeCloseTo(1500, 9)
    expect(wiersz(r.value.wiersze, "WPC-W-SREDNIA-MOC")?.kw).toBeCloseTo(0.5, 9)
    expect(r.assumptions).toContainEqual({ kod: "WPC-ZAL-ZYSKI-A-MOC" })
  })

  it("5.82: 2,5 kWh/dobę = 0,104 kW średnio (nie 0,3 kW z przykładu — Dyrektywa #5)", () => {
    expect(licz("zyski-bytowe", { zyskiKwhDoba: 2.5 }).value.glowny?.params.kw).toBeCloseTo(2.5 / 24, 9)
  })

  it("5.69: 50 → 40 °C, COP 3,0 → widełki 3,6–3,9 z reguły 2–3%/°C; z COP 3,8 i 7125 kWh → 500 kWh", () => {
    const widelki = licz("temp-zasilania", { tPrzedC: 50, tPoC: 40, copPrzed: 3 })
    expect(widelki.value.glowny?.params.min).toBeCloseTo(3.6, 9)
    expect(widelki.value.glowny?.params.max).toBeCloseTo(3.9, 9)
    const r = licz("temp-zasilania", { tPrzedC: 50, tPoC: 40, copPrzed: 3, copPo: 3.8, cieploSezonKwh: 7125 })
    expect(r.value.glowny?.params.oszczednosc).toBeCloseTo(500, 9)
  })

  it("5.93: temp. źródła wymaga COP po zmianie (bez reguły kciuka)", () => {
    expect(licz("temp-zrodla", { tPrzedC: 0, tPoC: 5, copPrzed: 3 }).status).toBe("INCOMPLETE")
    const r = licz("temp-zrodla", { tPrzedC: 0, tPoC: 5, copPrzed: 3, copPo: 3.45 })
    expect(r.value.glowny?.params.pct).toBeCloseTo(15, 9)
  })

  it("5.96: defrost 1,2 kWh/dobę × 100 dni = 120 kWh = 4% z 3000 kWh (źródło)", () => {
    const r = licz("defrost", { defrostKwhDoba: 1.2, dniSzronienia: 100, zuzyciePompySezonKwh: 3000 })
    expect(r.value.glowny?.params.kwh).toBeCloseTo(120, 9)
    expect(wiersz(r.value.wiersze, "WPC-W-DEFROST-UDZIAL")?.pct).toBeCloseTo(4, 9)
  })
})

describe("praca pompy, hydraulika, dolne źródło, bufor", () => {
  it("5.97: tryb cichy 83,3% mocy → praca +20%, przy COP wyższym o 1/0,95 zużycie −5% (źródło)", () => {
    const r = licz("ograniczenie-mocy", { mocPompyKw: 6, ograniczeniePct: 100 / 1.2, copPrzed: 3, copOgraniczony: 3 / 0.95 })
    expect(r.value.glowny?.params.pct).toBeCloseTo(20, 9)
    expect(wiersz(r.value.wiersze, "WPC-W-ENERGIA-ZMIANA")?.pct).toBeCloseTo(-5, 9)
  })

  it("5.98: 60% mocy → +67% (nie +40% z przykładu); deficyt i przeciążony falownik → 🟡", () => {
    const r = licz("ograniczenie-mocy", { mocPompyKw: 8, ograniczeniePct: 60, zapotrzebowanieKw: 6, copPrzed: 2.5, mocFalownikaKw: 3 })
    expect(r.value.glowny?.params.pct).toBeCloseTo(200 / 3, 9)
    expect(r.warnings.map((x) => x.code)).toEqual(["WPC-OGRANICZENIE-DEFICYT", "WPC-FALOWNIK-PRZECIAZONY"])
  })

  it("5.94: 8,72 kW przy ΔT 5 K → 1,5 m³/h (echo ciepła właściwego wody M2)", () => {
    const mocKw = 1.5 * 1000 * WSPOLCZYNNIK_KWH_NA_L_K * 5
    expect(licz("przeplyw", { mocPompyKw: mocKw, dTObieguK: 5 }).value.glowny?.params.m3h).toBeCloseTo(1.5, 9)
  })

  it("5.91: 2 × 80 m = 32 000 zł, 1 × 120 m = 24 000 zł przy 200 zł/m; wariant B za mały dla 8 kW", () => {
    const r = licz("odwierty", { liczbaA: 2, glebokoscAM: 80, liczbaB: 1, glebokoscBM: 120, cenaZlM: 200, wNaM: 60, mocPompyKw: 8 })
    expect(wiersz(r.value.wiersze, "WPC-W-WARIANT-A")?.koszt).toBe(32000)
    expect(wiersz(r.value.wiersze, "WPC-W-WARIANT-B")?.koszt).toBe(24000)
    expect(r.value.glowny?.params.roznica).toBe(-8000)
    expect(r.warnings.map((x) => x.code)).toEqual(["WPC-ODWIERTY-ZA-MALO"])
  })

  it("5.100: bufor 4× wody instalacji → 20 → 4 starty/dobę (źródło)", () => {
    const woda = 2.4 / (5 * WSPOLCZYNNIK_KWH_NA_L_K)
    const r = licz("bufor-starty", { mocPompyKw: 8, obciazenieKw: 4, wodaInstalacjiL: woda, buforL: 4 * woda, histerezaK: 5 })
    expect(r.value.glowny?.params.bez).toBeCloseTo(20, 9)
    expect(r.value.glowny?.params.z).toBeCloseTo(4, 9)
  })

  it("5.100: obciążenie ≥ moc pompy → praca ciągła, ℹ️", () => {
    const r = licz("bufor-starty", { mocPompyKw: 4, obciazenieKw: 5, wodaInstalacjiL: 100, buforL: 200, histerezaK: 5 })
    expect(r.warnings.map((x) => x.code)).toEqual(["WPC-BUFOR-PRACA-CIAGLA"])
    expect(r.status).toBe("VALID")
  })
})
