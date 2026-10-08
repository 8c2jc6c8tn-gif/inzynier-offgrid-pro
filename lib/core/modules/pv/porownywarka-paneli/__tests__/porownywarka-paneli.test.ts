import { describe, expect, it } from "vitest"
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"
import { calculatePorownywarkaPaneli } from "../calculator"
import { domyslnyWyborKryteriow, punktyWzgledne } from "../kryteria"
import type { DanePanelu, PorownywarkaInput } from "../input"
import { sprawnoscWzgledna } from "../uzysk"

/**
 * Rok syntetyczny, który da się policzyć ręcznie: płaszczyzna pozioma (nachylenie 0°), dni = 0, ghi = dhi = G, więc
 * G_poa = G w każdej godzinie (F(0) = 1, brak członu odbitego). Styczeń: G = 200 W/m², −5 °C; lipiec: G = 600 W/m², 20 °C;
 * pozostałe miesiące: 0. Każdy miesiąc = pełne doby, styczeń i lipiec po 744 godziny. Referencje policzone osobno w Pythonie.
 */
function rok(bezTemperatury = false): RekordGodzinowy[] {
  const start = Date.UTC(2018, 0, 1)
  return Array.from({ length: 8760 }, (_, h) => {
    const czasUtcMs = start + h * 3_600_000
    const m = new Date(czasUtcMs).getUTCMonth()
    const g = m === 0 ? 200 : m === 6 ? 600 : 0
    return { czasUtcMs, ghi: g, dni: 0, dhi: g, ...(bezTemperatury ? {} : { tempC: m === 0 ? -5 : 20 }) }
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
  bifacjalny: false,
  ...p,
})

const wejscie = (panele: DanePanelu[], reszta: Partial<PorownywarkaInput> = {}): PorownywarkaInput => ({
  szerokoscGeograficzna: 52.2,
  dlugoscGeograficzna: 21,
  daneGodzinowe: rok(),
  miejsce: { nachylenieDeg: 0, azymutDeg: 180, albedo: 0.2 },
  liczbaPaneli: 1,
  panele,
  wycena: null,
  kryteria: domyslnyWyborKryteriow(),
  ...reszta,
})

describe("calculatePorownywarkaPaneli — uzysk (referencje ręczne)", () => {
  it("model pełny: styczeń 79,5243 kWh, lipiec 214,2999 kWh dla 500 W / γ −0,29 / NOCT 45", () => {
    const w = calculatePorownywarkaPaneli(
      wejscie([panel({ id: "A", cenaBruttoZl: 600 }), panel({ id: "B", pmaxW: 400, gammaPctNaC: -0.35, cenaBruttoZl: 400 })]),
    )
    expect(w.status).toBe("VALID")
    const [a, b] = w.value.panele
    expect(w.value.zakresModelu).toEqual({ temperatura: true, slabeSwiatlo: false })
    expect(a!.miesiaceKwh[0]).toBeCloseTo(79.5243, 3)
    expect(a!.miesiaceKwh[6]).toBeCloseTo(214.2999, 3)
    expect(b!.miesiaceKwh[0]).toBeCloseTo(64.4676, 3)
    expect(b!.miesiaceKwh[6]).toBeCloseTo(169.9668, 3)
    // zima = XI–II: tu tylko styczeń niezerowy; rok = styczeń + lipiec
    expect(a!.zimaKwh).toBeCloseTo(79.5243, 3)
    expect(a!.rokKwh).toBeCloseTo(79.5243 + 214.2999, 3)
  })

  it("liczba paneli skaluje energię liniowo", () => {
    const w = calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })], { liczbaPaneli: 3 }))
    expect(w.value.panele[0]!.miesiaceKwh[0]).toBeCloseTo(3 * 79.5243, 3)
  })

  it("jeden panel bez γ → uproszczony model dla WSZYSTKICH (P_STC · G / 1000): styczeń 74,4, lipiec 223,2 kWh", () => {
    const w = calculatePorownywarkaPaneli(wejscie([panel({ id: "A" }), panel({ id: "B", gammaPctNaC: null })]))
    expect(w.value.zakresModelu.temperatura).toBe(false)
    expect(w.value.panele[0]!.miesiaceKwh[0]).toBeCloseTo(74.4, 6)
    expect(w.value.panele[0]!.miesiaceKwh[6]).toBeCloseTo(223.2, 6)
    expect(w.warnings.map((x) => x.code)).toContain("PORP-MODEL-UPROSZCZONY")
  })

  it("TMY bez temperatury godzinowej → model uproszczony + informacja, nigdy średnia miesięczna w zastępstwie", () => {
    const w = calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })], { daneGodzinowe: rok(true) }))
    expect(w.value.zakresModelu.temperatura).toBe(false)
    expect(w.value.panele[0]!.miesiaceKwh[0]).toBeCloseTo(74.4, 6)
    expect(w.warnings.map((x) => x.code)).toContain("PORP-BRAK-TEMPERATURY-GODZINOWEJ")
  })

  it("sprawność przy 200 W/m² = 96%: styczeń (G = 200) ×0,96, lipiec (G = 600) ×0,98 — tylko gdy wszystkie panele ją mają", () => {
    const oba = calculatePorownywarkaPaneli(
      wejscie([panel({ id: "A", sprawnoscWzglednaPrzy200WPct: 96 }), panel({ id: "B", sprawnoscWzglednaPrzy200WPct: 96 })]),
    )
    expect(oba.value.zakresModelu.slabeSwiatlo).toBe(true)
    expect(oba.value.panele[0]!.miesiaceKwh[0]).toBeCloseTo(76.343328, 4)
    expect(oba.value.panele[0]!.miesiaceKwh[6]).toBeCloseTo(210.013902, 4)
    const jeden = calculatePorownywarkaPaneli(wejscie([panel({ id: "A", sprawnoscWzglednaPrzy200WPct: 96 }), panel({ id: "B" })]))
    expect(jeden.value.zakresModelu.slabeSwiatlo).toBe(false)
    expect(jeden.value.panele[0]!.miesiaceKwh[0]).toBeCloseTo(79.5243, 3)
  })

  it("sprawnoscWzgledna: 1 od 1000, wartość karty od 200 w dół, liniowo pomiędzy, 1 bez danych", () => {
    const p = panel({ id: "A", sprawnoscWzglednaPrzy200WPct: 96 })
    expect(sprawnoscWzgledna(p, 1200)).toBe(1)
    expect(sprawnoscWzgledna(p, 1000)).toBe(1)
    expect(sprawnoscWzgledna(p, 600)).toBeCloseTo(0.98, 12)
    expect(sprawnoscWzgledna(p, 200)).toBeCloseTo(0.96, 12)
    expect(sprawnoscWzgledna(p, 50)).toBeCloseTo(0.96, 12)
    expect(sprawnoscWzgledna(panel({ id: "B" }), 50)).toBe(1)
  })

  it("panel bifacjalny: tylko strona przednia + informacja", () => {
    const w = calculatePorownywarkaPaneli(wejscie([panel({ id: "A", bifacjalny: true })]))
    expect(w.warnings.map((x) => x.code)).toContain("PORP-BIFACJALNY-POMINIETY")
    expect(w.value.panele[0]!.miesiaceKwh[0]).toBeCloseTo(79.5243, 3)
  })
})

describe("calculatePorownywarkaPaneli — ekonomia", () => {
  const A = panel({ id: "A", cenaBruttoZl: 600, degradacjaPierwszyRokPct: 1, degradacjaLiniowaPctNaRok: 0.4 })

  it("koszt zimowej kWh w 25 latach, moc po 25 latach, cena za Wp", () => {
    const w = calculatePorownywarkaPaneli(wejscie([A], { liczbaPaneli: 2 }))
    const a = w.value.panele[0]!
    // zima = 2 × 79,5243 = 159,0486 kWh; Σ współczynników lat 1…25 = 23,55 → 1200 / (159,0486 · 23,55)
    expect(a.cenaRazemZl).toBe(1200)
    expect(a.kosztZimowejKwhZl).toBeCloseTo(0.32037638, 6)
    expect(a.moc25LatPct).toBeCloseTo(89.4, 10)
    expect(a.cenaZaWpZl).toBeCloseTo(1.2, 12)
  })

  it("bez degradacji z karty: współczynnik 1 na rok (25 lat)", () => {
    const w = calculatePorownywarkaPaneli(wejscie([panel({ id: "A", cenaBruttoZl: 600 })]))
    expect(w.value.panele[0]!.kosztZimowejKwhZl).toBeCloseTo(600 / (79.5243 * 25), 6)
    expect(w.value.panele[0]!.moc25LatPct).toBeNull()
  })

  it("brak ceny → część „zł” pusta, uzysk policzony, ostrzeżenie PORP-BRAK-CENY", () => {
    const w = calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })]))
    const a = w.value.panele[0]!
    expect(a.kosztZimowejKwhZl).toBeNull()
    expect(a.cenaRazemZl).toBeNull()
    expect(a.zimaKwh).toBeGreaterThan(0)
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings.map((x) => x.code)).toContain("PORP-BRAK-CENY")
  })

  it("wycena ręczna 1,2 zł/kWh: wartość zimy i roku, okres zwrotu = cena razem / wartość roczna; różnica zimowa lider vs drugi", () => {
    const w = calculatePorownywarkaPaneli(
      wejscie([panel({ id: "A", cenaBruttoZl: 600 }), panel({ id: "B", pmaxW: 400, gammaPctNaC: -0.35, cenaBruttoZl: 400 })], {
        wycena: { rodzaj: "reczna", zlKwh: 1.2 },
      }),
    )
    const a = w.value.panele[0]!
    expect(a.wartoscZimaZl).toBeCloseTo(79.5243 * 1.2, 3)
    expect(a.wartoscRokZl).toBeCloseTo((79.5243 + 214.2999) * 1.2, 3)
    expect(a.okresZwrotuLat).toBeCloseTo(600 / ((79.5243 + 214.2999) * 1.2), 6)
    expect(w.value.roznicaZimowa).toMatchObject({ liderId: "A", drugiId: "B" })
    expect(w.value.roznicaZimowa!.roznicaKwh).toBeCloseTo(79.5243 - 64.4676, 3)
    expect(w.value.roznicaZimowa!.roznicaZl).toBeCloseTo((79.5243 - 64.4676) * 1.2, 3)
  })

  it("wycena z agregatu: koszt kWh = zużycie [l/h] · cena [zł/l] / (moc · obciążenie): 0,5 · 7 / (2 · 0,5) = 3,5 zł/kWh", () => {
    const w = calculatePorownywarkaPaneli(
      wejscie([panel({ id: "A" })], { wycena: { rodzaj: "agregat", mocKw: 2, obciazeniePct: 50, zuzycieLH: 0.5, cenaPaliwaZlL: 7 } }),
    )
    expect(w.value.stawkaZlKwh).toBeCloseTo(3.5, 12)
    expect(w.value.panele[0]!.wartoscZimaZl).toBeCloseTo(79.5243 * 3.5, 3)
  })

  it("wycena agregatu niekompletna → tryb „suchy” (bez stawki), nie zgadywanie", () => {
    const w = calculatePorownywarkaPaneli(
      wejscie([panel({ id: "A" })], { wycena: { rodzaj: "agregat", mocKw: 2, obciazeniePct: 50, zuzycieLH: 0, cenaPaliwaZlL: 7 } }),
    )
    expect(w.value.stawkaZlKwh).toBeNull()
    expect(w.value.panele[0]!.wartoscZimaZl).toBeNull()
  })
})

describe("kryteria i gwiazdki", () => {
  it("punktyWzgledne: większe lepsze → 10·v/max; mniejsze lepsze → 10·min/v; γ = 0 (min ≤ 0) → skala liniowa min–max", () => {
    expect(punktyWzgledne([100, 80, 50], "wyzej")).toEqual([10, 8, 5])
    expect(punktyWzgledne([0.2, 0.4, 0.5], "nizej")[1]).toBeCloseTo(5, 12)
    expect(punktyWzgledne([0, 0.3], "nizej")).toEqual([10, 0])
    expect(punktyWzgledne([0, 0], "wyzej")).toEqual([0, 0])
  })

  it("wagi przeliczają się do 100% z policzonych kryteriów; opisowe i odznaczone nie liczą się; gwiazdki = Σ waga·punkty", () => {
    const w = calculatePorownywarkaPaneli(
      wejscie(
        [
          panel({ id: "A", cenaBruttoZl: 600, sprawnoscWzglednaPrzy200WPct: 96, degradacjaPierwszyRokPct: 1, degradacjaLiniowaPctNaRok: 0.4 }),
          panel({ id: "B", pmaxW: 400, gammaPctNaC: -0.35, cenaBruttoZl: 400, sprawnoscWzglednaPrzy200WPct: 96, degradacjaPierwszyRokPct: 2, degradacjaLiniowaPctNaRok: 0.55 }),
        ],
        { liczbaPaneli: 2 },
      ),
    )
    const k = Object.fromEntries(w.value.kryteria.map((x) => [x.id, x]))
    expect(k.uzyskRoczny!.status).toBe("odznaczone")
    expect(k.cenaZaWp!.status).toBe("odznaczone")
    expect(k.zacienienieSnieg!.status).toBe("opisowe")
    const policzone = w.value.kryteria.filter((x) => x.status === "policzone")
    expect(policzone.map((x) => x.id).sort()).toEqual(["degradacjaGwarancja", "kosztZimowejKwh", "slabeSwiatlo", "temperatura", "uzyskZimowy"])
    // wagi startowe 30+20+15+5+5 = 75 → efektywne ×100/75
    expect(policzone.reduce((a, x) => a + x.wagaEfektywna!, 0)).toBeCloseTo(100, 10)
    expect(k.uzyskZimowy!.wagaEfektywna).toBeCloseTo(40, 10)
    // panel A: najlepszy w uzysku zimowym (10), degradacji (moc25 89,4 vs 100−2−24·0,55 = 84,8), temperaturze (|γ| 0,29 < 0,35)
    expect(k.uzyskZimowy!.punkty[0]).toBe(10)
    expect(k.uzyskZimowy!.punkty[1]).toBeCloseTo((10 * 64.4676) / 79.5243, 3)
    expect(k.degradacjaGwarancja!.punkty[1]).toBeCloseTo((10 * 84.8) / 89.4, 10)
    expect(k.temperatura!.punkty[1]).toBeCloseTo((10 * 0.29) / 0.35, 10)
    const gw = w.value.gwiazdki
    const recznie = (i: number) =>
      policzone.reduce((a, x) => a + (x.wagaEfektywna! * x.punkty[i]!) / 100, 0)
    expect(gw[0]).toBeCloseTo(recznie(0), 12)
    expect(gw[1]).toBeCloseTo(recznie(1), 12)
    expect(gw[0]!).toBeGreaterThan(gw[1]!)
  })

  it("kryterium bez danych JEDNEGO panelu jest pominięte dla wszystkich z listą braków (reguła porównywalności)", () => {
    const w = calculatePorownywarkaPaneli(
      wejscie([panel({ id: "A", sprawnoscWzglednaPrzy200WPct: 96 }), panel({ id: "B" })]),
    )
    const sl = w.value.kryteria.find((x) => x.id === "slabeSwiatlo")!
    expect(sl.status).toBe("pominiete-brak-danych")
    expect(sl.brakuje).toEqual(["Panel B"])
    expect(sl.wagaEfektywna).toBeNull()
  })

  it("jeden panel albo brak policzonych kryteriów → bez gwiazdek", () => {
    expect(calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })])).value.gwiazdki).toEqual([null])
    const bez = calculatePorownywarkaPaneli(
      wejscie([panel({ id: "A" }), panel({ id: "B" })], { kryteria: Object.fromEntries(Object.keys(domyslnyWyborKryteriow()).map((k) => [k, false])) as PorownywarkaInput["kryteria"] }),
    )
    expect(bez.value.gwiazdki).toEqual([null, null])
    expect(bez.warnings.map((x) => x.code)).toContain("PORP-BRAK-KRYTERIOW")
  })
})

describe("walidacja i kompletność", () => {
  it("bez danych godzinowych, miejsca, liczby paneli albo paneli → INCOMPLETE", () => {
    const baza = wejscie([panel({ id: "A" })])
    expect(calculatePorownywarkaPaneli({ ...baza, daneGodzinowe: undefined }).status).toBe("INCOMPLETE")
    expect(calculatePorownywarkaPaneli({ ...baza, miejsce: null }).status).toBe("INCOMPLETE")
    expect(calculatePorownywarkaPaneli({ ...baza, liczbaPaneli: null }).status).toBe("INCOMPLETE")
    expect(calculatePorownywarkaPaneli({ ...baza, panele: [] }).status).toBe("INCOMPLETE")
  })

  it("więcej niż 4 panele (U20), zła liczba paneli, kąt poza zakresem, ujemna cena → INVALID_INPUT z kodami", () => {
    const pieciu = ["A", "B", "C", "D", "E"].map((id) => panel({ id }))
    expect(calculatePorownywarkaPaneli(wejscie(pieciu)).warnings.map((x) => x.code)).toContain("PORP-ZA-DUZO-PANELI")
    expect(calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })], { liczbaPaneli: 2.5 })).warnings.map((x) => x.code)).toContain("PORP-LICZBA-PANELI-POZA-ZAKRESEM")
    expect(calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })], { miejsce: { nachylenieDeg: 120, azymutDeg: 180 } })).warnings.map((x) => x.code)).toContain("PORP-NACHYLENIE-POZA-ZAKRESEM")
    const ujemna = calculatePorownywarkaPaneli(wejscie([panel({ id: "A", cenaBruttoZl: -1 })]))
    expect(ujemna.status).toBe("INVALID_INPUT")
    expect(ujemna.warnings.map((x) => x.code)).toContain("PORP-WARTOSC-UJEMNA")
  })
})
