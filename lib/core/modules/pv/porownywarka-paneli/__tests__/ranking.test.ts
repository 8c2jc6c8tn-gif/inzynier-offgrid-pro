import { describe, expect, it } from "vitest"
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"
import type { DanePanelu } from "../input"
import { posortujRanking, przefiltrujKatalog, rankingKatalogu } from "../ranking"

/** Rok syntetyczny jak w testach A1/A2: tylko styczeń (G = 200 W/m², −5 °C) i lipiec (600 W/m², 20 °C); referencje na 1 panel 500 W / γ −0,29 / NOCT 45: styczeń 79,5243 kWh, lipiec 214,2999 kWh. */
function rok(): RekordGodzinowy[] {
  const start = Date.UTC(2018, 0, 1)
  return Array.from({ length: 8760 }, (_, h) => {
    const czasUtcMs = start + h * 3_600_000
    const m = new Date(czasUtcMs).getUTCMonth()
    const g = m === 0 ? 200 : m === 6 ? 600 : 0
    return { czasUtcMs, ghi: g, dni: 0, dhi: g, tempC: m === 0 ? -5 : 20 }
  })
}

const panel = (p: Partial<DanePanelu> & { id: string }): DanePanelu => ({
  nazwa: `Panel ${p.id}`,
  pmaxW: 500,
  cenaBruttoZl: null,
  gammaPctNaC: -0.29,
  noctC: 45,
  sprawnoscWzglednaPrzy200WPct: null,
  degradacjaPierwszyRokPct: null,
  degradacjaLiniowaPctNaRok: null,
  dlugoscMm: 1762,
  szerokoscMm: 1134,
  masaKg: 22,
  bifacjalny: false,
  ...p,
})

const wspolne = { szerokoscGeograficzna: 52.2, dlugoscGeograficzna: 21, daneGodzinowe: rok(), miejsce: { nachylenieDeg: 0, azymutDeg: 180, albedo: 0.2 } }

describe("rankingKatalogu", () => {
  it("zima i rok jednego panelu = wartości z referencji; zima na m² = zima / pole panelu", () => {
    const w = rankingKatalogu({ ...wspolne, wymiaryMiejsca: null, panele: [panel({ id: "A" })] })
    const a = w.wiersze[0]!
    expect(a.zimaNaPanelKwh).toBeCloseTo(79.5243, 3)
    expect(a.rokNaPanelKwh).toBeCloseTo(79.5243 + 214.2999, 3)
    expect(a.zimaNaM2Kwh).toBeCloseTo(79.5243 / (1.762 * 1.134), 3)
    expect(a.liczbaWMiejscu).toBeNull()
    expect(a.zimaWMiejscuKwh).toBeNull()
  })

  it("z wymiarami miejsca: liczba sztuk z pakowania × energia jednego panelu (6 × 4 m, bez marginesu: 10 sztuk 1762 × 1134)", () => {
    const w = rankingKatalogu({
      ...wspolne,
      wymiaryMiejsca: { dlugoscM: 6, szerokoscM: 4, marginesM: 0, montaz: "rownolegly" },
      panele: [panel({ id: "A" }), panel({ id: "B", dlugoscMm: 2278 })],
    })
    expect(w.wiersze.map((x) => x.liczbaWMiejscu)).toEqual([10, 7])
    expect(w.wiersze[0]!.zimaWMiejscuKwh).toBeCloseTo(10 * 79.5243, 2)
  })

  it("montaż pochylony na konstrukcji: bez liczby sztuk (brak reguły odstępu)", () => {
    const w = rankingKatalogu({ ...wspolne, wymiaryMiejsca: { dlugoscM: 6, szerokoscM: 4, marginesM: 0, montaz: "pochylony-na-konstrukcji" }, panele: [panel({ id: "A" })] })
    expect(w.wiersze[0]!.liczbaWMiejscu).toBeNull()
  })

  it("reguła porównywalności: jeden panel bez NOCT wyłącza temperaturę dla wszystkich (uzysk = P · G / 1000 · 744 h)", () => {
    const w = rankingKatalogu({ ...wspolne, wymiaryMiejsca: null, panele: [panel({ id: "A" }), panel({ id: "B", noctC: null })] })
    expect(w.zakresModelu.temperatura).toBe(false)
    expect(w.wiersze[0]!.zimaNaPanelKwh).toBeCloseTo(74.4, 6)
  })
})

describe("filtry i sortowanie rankingu", () => {
  const katalog = [panel({ id: "A", pmaxW: 450 }), panel({ id: "B", pmaxW: 550, dlugoscMm: 2278 }), panel({ id: "C", pmaxW: 600, dlugoscMm: null })]

  it("filtr mocy i najdłuższego boku; panel bez wymiarów odpada przy filtrze wymiaru", () => {
    expect(przefiltrujKatalog(katalog, { pmaxMinW: 500 }).map((p) => p.id)).toEqual(["B", "C"])
    expect(przefiltrujKatalog(katalog, { pmaxMaxW: 500 }).map((p) => p.id)).toEqual(["A"])
    expect(przefiltrujKatalog(katalog, { maxBokMm: 2000 }).map((p) => p.id)).toEqual(["A"])
    expect(przefiltrujKatalog(katalog, { maxBokMm: 2300 }).map((p) => p.id)).toEqual(["A", "B"])
    expect(przefiltrujKatalog(katalog, {}).map((p) => p.id)).toEqual(["A", "B", "C"])
  })

  it("sortowanie malejące po wybranym mierniku; brak wartości na końcu", () => {
    const w = rankingKatalogu({ ...wspolne, wymiaryMiejsca: null, panele: katalog })
    expect(posortujRanking(w.wiersze, "zimaNaPanel").map((x) => x.id)).toEqual(["C", "B", "A"])
    // zima na m²: panel C bez wymiarów → na końcu
    expect(posortujRanking(w.wiersze, "zimaNaM2").at(-1)!.id).toBe("C")
    expect(posortujRanking(w.wiersze, "zimaWMiejscu").every((x) => x.zimaWMiejscuKwh === null)).toBe(true)
  })
})
