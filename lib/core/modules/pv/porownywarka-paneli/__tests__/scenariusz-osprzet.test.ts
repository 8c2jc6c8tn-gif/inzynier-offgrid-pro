import { describe, expect, it } from "vitest"
import { znajdzPanelKatalogu } from "@/lib/core/dane/katalog-paneli-pv"
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"
import { calculatePorownywarkaPaneli } from "../calculator"
import { domyslnyWyborKryteriow } from "../kryteria"
import type { DanePanelu, PorownywarkaInput } from "../input"
import { kosztZestawuZOsprzetem, urzadzenieZWejsciaScenariusza, type OsprzetScenariuszaInput } from "../osprzet-zestawu"

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
/** JA Solar 500 W z katalogu (Voc 43,85 V, Isc 14,42 A, β −0,25 %/°C): ten sam panel w dwóch cenach. */
const panel = (id: string, cena: number): DanePanelu => ({ ...znajdzPanelKatalogu("ja-solar-jam60d41-lb-500")!, id, nazwa: id, cenaBruttoZl: cena })

/**
 * Ceny osprzętu nadpisane na okrągłe liczby (min = max), trasa kabla 0 m, rozdzielnia wyłączona (domyślnie): MC4 10 zł za parę, rozłącznik 100 zł,
 * ogranicznik 50 zł, konstrukcja 200 zł za panel, bezpiecznik 0 zł; urządzenie Victron SmartSolar 150/35 (jedno wejście, 2 stringi na wejście) po 1000 zł.
 */
const osprzet = (zmiana: Partial<OsprzetScenariuszaInput> = {}): OsprzetScenariuszaInput => ({
  urzadzenieId: "victron-smartsolar-150-35",
  napiecieAkumulatoraV: 24,
  cenaUrzadzeniaJednegoZl: 1000,
  trasaM: 0,
  bosWylaczone: ["rozdzielnia-dc"],
  bosCeny: { "kabel-pv": 0, mc4: 10, "bezpiecznik-dc": 0, "rozlacznik-dc": 100, "spd-dc": 50, konstrukcja: 200 },
  kurs: 1,
  ...zmiana,
})
const wejscie = (cenaA: number, o: OsprzetScenariuszaInput | null, zmiana: Partial<PorownywarkaInput> = {}): PorownywarkaInput => ({
  szerokoscGeograficzna: 52.2,
  dlugoscGeograficzna: 21,
  daneGodzinowe: rok(),
  miejsce: { nachylenieDeg: 0, azymutDeg: 180, albedo: 0.2 },
  liczbaPaneli: 3,
  panele: [panel("A", cenaA), panel("B", 400)],
  wycena: { rodzaj: "siec", zlKwh: 1 },
  kryteria: domyslnyWyborKryteriow(),
  tminC: -20,
  osprzetScenariusza: o,
  ...zmiana,
})
const kody = (r: ReturnType<typeof calculatePorownywarkaPaneli>) => r.assumptions.map((a) => (typeof a === "string" ? a : a.kod))

describe("koszt zestawu z urządzeniem i osprzętem — ręczny rachunek (spec 41)", () => {
  const u = urzadzenieZWejsciaScenariusza(osprzet())!
  const koszt = (n: number) => kosztZestawuZOsprzetem(panel("B", 400), 400 * n, n, -20, u)

  it("3 panele: 3 w szeregu (Voc 146,35 V ≤ 150 V), jedno urządzenie, 1 string → panele 1200 + urządzenie 1000 + MC4 20 + rozłącznik 100 + ogranicznik 50 + konstrukcja 600 = 2970", () => {
    expect(koszt(3)).toEqual({ minZl: 2970, maxZl: 2970, niepelny: false })
  })

  it("4 panele: układ 2×2 na jednym urządzeniu → 1600 + 1000 + 40 + 100 + 50 + 800 = 3590", () => {
    expect(koszt(4)!.minZl).toBeCloseTo(3590, 9)
  })

  it("5 paneli: tylko 5 równolegle (3 w szeregu nie dzieli 5), 3 urządzenia po 2 stringi → 2000 + 3000 + 100 + 300 + 150 + 1000 = 6550", () => {
    expect(koszt(5)!.minZl).toBeCloseTo(6550, 9)
  })

  it("bez Tmin albo bez danych elektrycznych panelu nie ma wyceny (null), a brak długości trasy kabla oznacza zaniżoną cenę (niepelny)", () => {
    expect(kosztZestawuZOsprzetem(panel("B", 400), 1200, 3, null, u)).toBeNull()
    expect(kosztZestawuZOsprzetem({ ...panel("B", 400), elektryka: null }, 1200, 3, -20, u)).toBeNull()
    const bezTrasy = urzadzenieZWejsciaScenariusza(osprzet({ trasaM: null, bosCeny: { mc4: 10 } }))!
    expect(kosztZestawuZOsprzetem(panel("B", 400), 1200, 3, -20, bezTrasy)!.niepelny).toBe(true)
  })
})

describe("scenariusz „więcej paneli” z urządzeniem i osprzętem w silniku (spec 41)", () => {
  it("cena A 1010 zł/szt.: zestawy 4800 i 2970 zł; za różnicę 3 dodatkowe panele (6 szt. na jednym urządzeniu = 4790 zł), choć 5 szt. się nie mieści (6550 zł)", () => {
    const r = calculatePorownywarkaPaneli(wejscie(1010, osprzet()))
    const sc = r.value.scenariusze[0]!
    const z = sc.zOsprzetem!
    expect(z.drozszyRazemMinZl).toBeCloseTo(4800, 9)
    expect(z.drozszyRazemMaxZl).toBeCloseTo(4800, 9)
    expect(z.tanszyRazemMinZl).toBeCloseTo(2970, 9)
    expect(z.oszczednoscMinZl).toBeCloseTo(1830, 9)
    expect(z.dodatkowePaneleMin).toBe(3)
    expect(z.dodatkowePaneleMax).toBe(3)
    expect(z.niepelny).toBe(false)
    // Same panel prices alone would allow (3030 − 1200) / 400 = 4 extra panels.
    expect(sc.dodatkowePanele).toBe(4)
    expect(kody(r)).toContain("PORP-ZAL-SCENARIUSZ-Z-OSPRZETEM")
  })

  it("energia i przewaga dotyczą ostrożnej liczby dodatkowych paneli: 3 dodatkowe sztuki tego samego panelu dają tyle, co zestaw B z 3 sztuk", () => {
    const r = calculatePorownywarkaPaneli(wejscie(1010, osprzet()))
    const z = r.value.scenariusze[0]!.zOsprzetem!
    const b = r.value.panele.find((p) => p.id === "B")!
    expect(z.dodatkoweRokKwh).toBeCloseTo(b.rokKwh, 9)
    expect(z.dodatkoweZimaKwh).toBeCloseTo(b.zimaKwh, 9)
    expect(z.wTymSamymMiejscu).toBe(3)
    expect(z.naScianie).toBe(0)
    const a = r.value.panele.find((p) => p.id === "A")!
    expect(z.przewagaRokKwh).toBeCloseTo(2 * b.rokKwh - a.rokKwh, 9)
  })

  it("różnica za mała na kolejny panel razem z osprzętem: cena A 700 zł → 3870 zł, panel B k=1 kosztuje 3590 zł, k=2 6550 zł, k=3 4790 zł > 3870 zł; wychodzi 1 dodatkowy", () => {
    const z = calculatePorownywarkaPaneli(wejscie(700, osprzet())).value.scenariusze[0]!.zOsprzetem!
    expect(z.drozszyRazemMinZl).toBeCloseTo(3870, 9)
    expect(z.dodatkowePaneleMin).toBe(1)
    expect(z.dodatkowePaneleMax).toBe(1)
  })

  it("różnica nie starcza na kolejny panel: cena A 500 zł → zestaw 3270 zł, B k=1 kosztuje 3590 zł → 0 dodatkowych", () => {
    const z = calculatePorownywarkaPaneli(wejscie(500, osprzet())).value.scenariusze[0]!.zOsprzetem!
    expect(z.dodatkowePaneleMin).toBe(0)
    expect(z.dodatkowePaneleMax).toBe(0)
    // Identical panels: without extra panels the sets produce the same.
    expect(z.przewagaRokKwh).toBeCloseTo(0, 9)
  })

  it("zakres cen osprzętu daje zakres liczby paneli: ostrożna liczba nigdy nie przekracza optymistycznej, a wynik z samymi cenami z cennika mieści się między nimi", () => {
    const o = osprzet({ bosCeny: {}, trasaM: 15 })
    const z = calculatePorownywarkaPaneli(wejscie(1010, o)).value.scenariusze[0]!.zOsprzetem!
    expect(z.dodatkowePaneleMin).toBeLessThanOrEqual(z.dodatkowePaneleMax)
    expect(z.drozszyRazemMaxZl).toBeGreaterThan(z.drozszyRazemMinZl)
    expect(z.dodatkowePaneleMax).toBeLessThanOrEqual(calculatePorownywarkaPaneli(wejscie(1010, null)).value.scenariusze[0]!.dodatkowePanele)
  })

  it("mikroinwerter GT-600 nie przyjmuje panelu 500 W (Imp 13,55 A > 12 A na wejście): żaden układ się nie mieści, więc nie ma wyceny (null), a nie zgadnięta cena", () => {
    const o = osprzet({ urzadzenieId: "vevor-mikro-gt-600", cenaUrzadzeniaJednegoZl: 300 })
    expect(calculatePorownywarkaPaneli(wejscie(1010, o)).value.scenariusze[0]!.zOsprzetem).toBeNull()
  })

  it("brak urządzenia w wejściu, nieznane urządzenie albo brak Tmin → zOsprzetem = null i brak założenia", () => {
    for (const r of [
      calculatePorownywarkaPaneli(wejscie(1010, null)),
      calculatePorownywarkaPaneli(wejscie(1010, osprzet({ urzadzenieId: "nie-ma-takiego" }))),
      calculatePorownywarkaPaneli(wejscie(1010, osprzet(), { tminC: null })),
    ]) {
      expect(r.value.scenariusze[0]!.zOsprzetem).toBeNull()
      expect(kody(r)).not.toContain("PORP-ZAL-SCENARIUSZ-Z-OSPRZETEM")
    }
  })

  it("główne liczby scenariusza (z samych cen paneli) nie zależą od osprzętu", () => {
    const bez = calculatePorownywarkaPaneli(wejscie(1010, null)).value.scenariusze[0]!
    const z = calculatePorownywarkaPaneli(wejscie(1010, osprzet())).value.scenariusze[0]!
    const { zOsprzetem: _a, ...reszta } = z
    const { zOsprzetem: _b, ...resztaBez } = bez
    void _a
    void _b
    expect(reszta).toEqual(resztaBez)
  })

  it.each([[{ kurs: 0 }], [{ trasaM: -1 }], [{ cenaUrzadzeniaJednegoZl: -5 }], [{ napiecieAkumulatoraV: 0 }], [{ bosCeny: { mc4: -1 } }]])("zły parametr %# to błąd danych", (zle) => {
    const r = calculatePorownywarkaPaneli(wejscie(1010, osprzet(zle)))
    expect(r.status).toBe("INVALID_INPUT")
    expect(r.warnings.map((e) => e.code)).toContain("PORP-OSPRZET-SCENARIUSZA-POZA-ZAKRESEM")
  })
})
