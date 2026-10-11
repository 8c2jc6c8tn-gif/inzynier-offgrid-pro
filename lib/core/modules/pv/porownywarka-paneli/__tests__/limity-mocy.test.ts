import { describe, expect, it } from "vitest"
import { bilansGodzinowy, dobierzPaneleNaZime, limityMocyPodane, type LimityMocy, type WejscieBilansu } from "../bilans-godzinowy"
import { calculatePorownywarkaPaneli, CALCULATOR_VERSION } from "../calculator"
import { domyslnyWyborKryteriow } from "../kryteria"
import type { DanePanelu, PorownywarkaInput } from "../input"
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"

/** Doby jak w `profil-dobowy.test.ts`: panele dają 2 kWh w godz. 10–13 (8 kWh/dobę), zużycie 1 kWh/godz. (24 kWh/dobę), wszystko w miesiącu 0. */
function doby(dni: number): Pick<WejscieBilansu, "produkcjaKwh" | "miesiac" | "godzinaLokalna" | "zapotrzebowanieMiesiaceKwh"> {
  const n = 24 * dni
  const produkcjaKwh = new Float64Array(n)
  const godzinaLokalna = new Uint8Array(n)
  for (let i = 0; i < n; i++) {
    godzinaLokalna[i] = i % 24
    if (godzinaLokalna[i]! >= 10 && godzinaLokalna[i]! <= 13) produkcjaKwh[i] = 2
  }
  return { produkcjaKwh, miesiac: new Uint8Array(n), godzinaLokalna, zapotrzebowanieMiesiaceKwh: [n, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
}
const suma = (xs: number[]) => xs.reduce((a, b) => a + b, 0)
const lim = (l: Partial<LimityMocy>): LimityMocy => ({ ladowanieKw: null, rozladowanieKw: null, falownikKw: null, ...l })

describe("limity mocy w bilansie godzinowym — ręczny rachunek (spec 40)", () => {
  it("limit ładowania 0,25 kW (bateria 10 kWh, 2 doby): do baterii 1 kWh/dobę, odcięte 3/dobę → bezpośrednio 8, z baterii 2, brak 38, odcięte 6", () => {
    const b = bilansGodzinowy({ ...doby(2), pojemnoscKwh: 10, sprawnoscCyklu: 1, limityMocy: lim({ ladowanieKw: 0.25 }) })
    expect(suma(b.bezposrednioMiesiaceKwh)).toBeCloseTo(8, 10)
    expect(suma(b.zBateriiMiesiaceKwh)).toBeCloseTo(2, 10)
    expect(suma(b.brakMiesiaceKwh)).toBeCloseTo(38, 10)
    expect(suma(b.odcieteMiesiaceKwh)).toBeCloseTo(6, 10)
  })

  it("limit rozładowania 0,1 kW: bateria oddaje po 2 kWh na dobę (20 godz. × 0,1) → z baterii 4, brak 36, nic nie przepada", () => {
    const b = bilansGodzinowy({ ...doby(2), pojemnoscKwh: 10, sprawnoscCyklu: 1, limityMocy: lim({ rozladowanieKw: 0.1 }) })
    expect(suma(b.bezposrednioMiesiaceKwh)).toBeCloseTo(8, 10)
    expect(suma(b.zBateriiMiesiaceKwh)).toBeCloseTo(4, 10)
    expect(suma(b.brakMiesiaceKwh)).toBeCloseTo(36, 10)
    expect(suma(b.odcieteMiesiaceKwh)).toBeCloseTo(0, 10)
  })

  it("limit falownika 0,5 kW bez baterii: do odbiorów 0,5 kWh/godz. w godz. 10–13 → bezpośrednio 4, brak 44, odcięte 12", () => {
    const b = bilansGodzinowy({ ...doby(2), pojemnoscKwh: 0, sprawnoscCyklu: null, limityMocy: lim({ falownikKw: 0.5 }) })
    expect(suma(b.bezposrednioMiesiaceKwh)).toBeCloseTo(4, 10)
    expect(suma(b.brakMiesiaceKwh)).toBeCloseTo(44, 10)
    expect(suma(b.odcieteMiesiaceKwh)).toBeCloseTo(12, 10)
  })

  it("limit falownika ogranicza łącznie moc z paneli i baterii: falownik 0,4 kW → bezpośrednio 3,2, z baterii 12,8 (cała nadwyżka 6,4/dobę), brak 32", () => {
    const b = bilansGodzinowy({ ...doby(2), pojemnoscKwh: 100, sprawnoscCyklu: 1, limityMocy: lim({ falownikKw: 0.4 }) })
    // Per day: panels directly 4 × 0.4 = 1.6, surplus 4 × 1.6 = 6.4 into the battery; the 20 other hours could take 20 × 0.4 = 8, so the 6.4 stored is all it gives.
    expect(suma(b.bezposrednioMiesiaceKwh)).toBeCloseTo(3.2, 10)
    expect(suma(b.zBateriiMiesiaceKwh)).toBeCloseTo(12.8, 10)
    expect(suma(b.brakMiesiaceKwh)).toBeCloseTo(32, 10)
  })

  it("bez limitów (brak obiektu, same null, bardzo duże limity) wynik jest identyczny jak w spec 34", () => {
    const wejscie = { ...doby(3), pojemnoscKwh: 5, sprawnoscCyklu: 0.9 }
    const bez = bilansGodzinowy(wejscie)
    for (const l of [null, lim({}), lim({ ladowanieKw: 1e9, rozladowanieKw: 1e9, falownikKw: 1e9 })]) {
      const z = bilansGodzinowy({ ...wejscie, limityMocy: l })
      expect(z.bezposrednioMiesiaceKwh).toEqual(bez.bezposrednioMiesiaceKwh)
      expect(z.zBateriiMiesiaceKwh).toEqual(bez.zBateriiMiesiaceKwh)
      expect(z.brakMiesiaceKwh).toEqual(bez.brakMiesiaceKwh)
      expect(z.odcieteMiesiaceKwh).toEqual(bez.odcieteMiesiaceKwh)
    }
  })

  it("zawsze: bezpośrednio + z baterii + brak = zużycie; ostrzejszy limit nigdy nie zmniejsza braku", () => {
    let poprzedni = -1
    for (const f of [Infinity, 2, 1, 0.5, 0.2]) {
      const b = bilansGodzinowy({ ...doby(4), pojemnoscKwh: 3, sprawnoscCyklu: 0.9, limityMocy: lim({ falownikKw: f === Infinity ? null : f, rozladowanieKw: f === Infinity ? null : f }) })
      expect(suma(b.bezposrednioMiesiaceKwh) + suma(b.zBateriiMiesiaceKwh) + suma(b.brakMiesiaceKwh)).toBeCloseTo(96, 9)
      expect(suma(b.brakMiesiaceKwh)).toBeGreaterThanOrEqual(poprzedni - 1e-9)
      poprzedni = suma(b.brakMiesiaceKwh)
    }
  })

  it("limityMocyPodane: tylko gdy którykolwiek limit jest liczbą", () => {
    expect(limityMocyPodane(null)).toBe(false)
    expect(limityMocyPodane(lim({}))).toBe(false)
    expect(limityMocyPodane(lim({ rozladowanieKw: 2 }))).toBe(true)
  })

  it("dobór paneli na zimę z limitem falownika: cel poniżej maksimum osiągalnego mimo limitu jest osiągalny, powyżej — nie", () => {
    const d = doby(2)
    const jednostkowa = d.produkcjaKwh
    const w = { miesiac: d.miesiac, godzinaLokalna: d.godzinaLokalna, zapotrzebowanieMiesiaceKwh: d.zapotrzebowanieMiesiaceKwh, pojemnoscKwh: 0, sprawnoscCyklu: null, limityMocy: lim({ falownikKw: 0.5 }) }
    const doborOk = dobierzPaneleNaZime(jednostkowa, w, 5)
    const doborZaWysoki = dobierzPaneleNaZime(jednostkowa, w, 50)
    expect(doborOk.pokrycieMaksPct).toBeCloseTo(100 * (4 / 48), 6)
    expect(doborZaWysoki.panelowGodzinowo).toBeNull()
  })
})

/** Rok syntetyczny z `porownywarka-paneli.test.ts`: styczeń G = 200 W/m², lipiec 600, reszta 0 (płaszczyzna pozioma). */
function rok(): RekordGodzinowy[] {
  const start = Date.UTC(2018, 0, 1)
  return Array.from({ length: 8760 }, (_, h) => {
    const czasUtcMs = start + h * 3_600_000
    const m = new Date(czasUtcMs).getUTCMonth()
    const g = m === 0 ? 200 : m === 6 ? 600 : 0
    return { czasUtcMs, ghi: g, dni: 0, dhi: g, tempC: m === 0 ? -5 : 20 }
  })
}
const panel: DanePanelu = {
  id: "A", nazwa: "Panel A", pmaxW: 500, cenaBruttoZl: 600, gammaPctNaC: -0.29, noctC: 45, sprawnoscWzglednaPrzy200WPct: null,
  degradacjaPierwszyRokPct: null, degradacjaLiniowaPctNaRok: null, dlugoscMm: null, szerokoscMm: null, masaKg: null, bifacjalny: false,
}
type Limity = NonNullable<NonNullable<PorownywarkaInput["bilansGodzinowy"]>["limityMocyKw"]>
const wejscie = (limityMocyKw?: Limity | null): PorownywarkaInput => ({
  szerokoscGeograficzna: 52.2, dlugoscGeograficzna: 21, daneGodzinowe: rok(), miejsce: { nachylenieDeg: 0, azymutDeg: 180, albedo: 0.2 },
  liczbaPaneli: 4, panele: [panel], wycena: { rodzaj: "siec", zlKwh: 1 }, kryteria: domyslnyWyborKryteriow(),
  zapotrzebowanieMiesiaceKwh: Array.from({ length: 12 }, () => 100),
  bilansGodzinowy: { pojemnoscKwh: 5, sprawnoscCyklu: null, ...(limityMocyKw === undefined ? {} : { limityMocyKw }) },
})
const kody = (r: ReturnType<typeof calculatePorownywarkaPaneli>) => r.assumptions.map((a) => (typeof a === "string" ? a : a.kod))

describe("limity mocy w Porównywarce (spec 40)", () => {
  it("niski limit falownika pogarsza pokrycie wobec braku limitów; założenie zmienia się z „bez limitów” na „limity”", () => {
    const bez = calculatePorownywarkaPaneli(wejscie())
    const z = calculatePorownywarkaPaneli(wejscie({ ladowanieKw: null, rozladowanieKw: null, falownikKw: 0.05 }))
    const pokrycie = (r: typeof bez) => r.value.panele[0]!.bilansGodzinowy!.pokrycieRokPct!
    expect(pokrycie(z)).toBeLessThan(pokrycie(bez))
    expect(kody(bez)).toContain("PORP-ZAL-BIL-BEZ-LIMITOW-MOCY")
    expect(kody(bez)).not.toContain("PORP-ZAL-BIL-LIMITY-MOCY")
    expect(kody(z)).toContain("PORP-ZAL-BIL-LIMITY-MOCY")
    expect(kody(z)).not.toContain("PORP-ZAL-BIL-BEZ-LIMITOW-MOCY")
    expect(z.calculatorVersion).toBe(CALCULATOR_VERSION)
  })

  it("limity wszystkie puste (null) nie zmieniają ani wyniku, ani założeń", () => {
    const bez = calculatePorownywarkaPaneli(wejscie())
    const puste = calculatePorownywarkaPaneli(wejscie({ ladowanieKw: null, rozladowanieKw: null, falownikKw: null }))
    expect(puste.value.panele[0]!.bilansGodzinowy!.pokrycieRokPct).toBe(bez.value.panele[0]!.bilansGodzinowy!.pokrycieRokPct)
    expect(kody(puste)).toContain("PORP-ZAL-BIL-BEZ-LIMITOW-MOCY")
  })

  it.each([[0], [-1], [Number.NaN]])("limit %s kW jest błędem danych", (zle) => {
    const r = calculatePorownywarkaPaneli(wejscie({ ladowanieKw: null, rozladowanieKw: zle, falownikKw: null }))
    expect(r.status).toBe("INVALID_INPUT")
    expect(r.warnings.map((e) => e.code)).toContain("PORP-LIMIT-MOCY-POZA-ZAKRESEM")
  })
})
