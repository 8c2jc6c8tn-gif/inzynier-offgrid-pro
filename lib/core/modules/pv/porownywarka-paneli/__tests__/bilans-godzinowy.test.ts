import { describe, expect, it } from "vitest"
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"
import { znajdzPanelKatalogu } from "@/lib/core/dane/katalog-paneli-pv"
import { bilansGodzinowy, podsumujBilans, type WejscieBilansu } from "../bilans-godzinowy"
import { calculatePorownywarkaPaneli } from "../calculator"
import type { DanePanelu, PorownywarkaInput } from "../input"
import { domyslnyWyborKryteriow } from "../kryteria"
import { godzinowaEnergiaPanelu, miesiecznaEnergiaPanelu, profilNaslonecznienia } from "../uzysk"

/**
 * Doba syntetyczna (ręczny rachunek): rekordy 0–23 w styczniu, panele dają 2 kWh w godzinach 10–13 (8 kWh/dobę), zużycie stałe
 * 1 kWh/godz. (zapotrzebowanie stycznia = 24 · dni). `dni` dób pod rząd, wszystkie w miesiącu 0.
 */
function doby(dni: number, produkcjaGodz13 = 2): Pick<WejscieBilansu, "produkcjaKwh" | "miesiac" | "godzinaLokalna" | "zapotrzebowanieMiesiaceKwh"> {
  const n = 24 * dni
  const produkcjaKwh = new Float64Array(n)
  const godzinaLokalna = new Uint8Array(n)
  for (let i = 0; i < n; i++) {
    godzinaLokalna[i] = i % 24
    if (godzinaLokalna[i]! >= 10 && godzinaLokalna[i]! <= 13) produkcjaKwh[i] = produkcjaGodz13
  }
  return { produkcjaKwh, miesiac: new Uint8Array(n), godzinaLokalna, zapotrzebowanieMiesiaceKwh: [n, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
}
const suma = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

describe("bilansGodzinowy — ręczny rachunek na dobach syntetycznych", () => {
  it("bez baterii: tylko zużycie w godzinach słońca, reszta to brak, nadwyżka z południa przepada", () => {
    // dobę: bezpośrednio 4·min(2;1) = 4, brak 20 godz. · 1 = 20, nadwyżka 4·1 = 4 (odcięta); 2 doby ×2
    const b = bilansGodzinowy({ ...doby(2), pojemnoscKwh: 0, sprawnoscCyklu: null })
    expect(suma(b.bezposrednioMiesiaceKwh)).toBeCloseTo(8, 10)
    expect(suma(b.zBateriiMiesiaceKwh)).toBe(0)
    expect(suma(b.brakMiesiaceKwh)).toBeCloseTo(40, 10)
    expect(suma(b.odcieteMiesiaceKwh)).toBeCloseTo(8, 10)
    expect(suma(b.zuzycieMiesiaceKwh)).toBeCloseTo(48, 10)
  })

  it("bateria 10 kWh, sprawność 1: nadwyżka z południa (4 kWh) pokrywa pierwsze godziny po zachodzie", () => {
    const b = bilansGodzinowy({ ...doby(2), pojemnoscKwh: 10, sprawnoscCyklu: 1 })
    expect(suma(b.bezposrednioMiesiaceKwh)).toBeCloseTo(8, 10)
    expect(suma(b.zBateriiMiesiaceKwh)).toBeCloseTo(8, 10)
    expect(suma(b.brakMiesiaceKwh)).toBeCloseTo(32, 10)
    expect(suma(b.odcieteMiesiaceKwh)).toBeCloseTo(0, 10)
  })

  it("bateria 2 kWh, sprawność 0,5: ładowanie 1 kWh nadwyżki daje 0,5 kWh w baterii, bateria się napełnia i nic nie przepada", () => {
    const b = bilansGodzinowy({ ...doby(2), pojemnoscKwh: 2, sprawnoscCyklu: 0.5 })
    expect(suma(b.zBateriiMiesiaceKwh)).toBeCloseTo(4, 10)
    expect(suma(b.brakMiesiaceKwh)).toBeCloseTo(36, 10)
    expect(suma(b.odcieteMiesiaceKwh)).toBeCloseTo(0, 10)
  })

  it("bateria 1 kWh, sprawność 0,5: pełna po dwóch godzinach, reszta nadwyżki przepada; bilans energii produkcji się zamyka", () => {
    const wejscie = { ...doby(2), pojemnoscKwh: 1, sprawnoscCyklu: 0.5 }
    const b = bilansGodzinowy(wejscie)
    expect(suma(b.zBateriiMiesiaceKwh)).toBeCloseTo(2, 10)
    expect(suma(b.brakMiesiaceKwh)).toBeCloseTo(38, 10)
    expect(suma(b.odcieteMiesiaceKwh)).toBeCloseTo(4, 10)
    // produkcja 16 = bezpośrednio 8 + (zmagazynowane 2 / 0,5 = 4) + odcięte 4
    expect(suma(b.bezposrednioMiesiaceKwh) + suma(b.zBateriiMiesiaceKwh) / 0.5 + suma(b.odcieteMiesiaceKwh)).toBeCloseTo(16, 10)
  })

  it("zawsze: bezpośrednio + z baterii + brak = zużycie", () => {
    for (const [c, eta] of [[0, null], [3, 0.9], [50, 1], [1, 0.5]] as const) {
      const b = bilansGodzinowy({ ...doby(3), pojemnoscKwh: c, sprawnoscCyklu: eta })
      expect(suma(b.bezposrednioMiesiaceKwh) + suma(b.zBateriiMiesiaceKwh) + suma(b.brakMiesiaceKwh)).toBeCloseTo(suma(b.zuzycieMiesiaceKwh), 9)
    }
  })

  it("rok liczony dwa razy: stan baterii z końca roku jest na początku roku (drugi przebieg)", () => {
    // jedna doba, 40 kWh w godz. 13 (reszta 0), duża bateria: nadwyżka 39 → wieczorem zostaje 28; w drugim przebiegu rano ma z czego brać
    const n = 24
    const produkcjaKwh = new Float64Array(n)
    produkcjaKwh[12] = 40
    const w: WejscieBilansu = { produkcjaKwh, miesiac: new Uint8Array(n), godzinaLokalna: Uint8Array.from({ length: n }, (_, i) => i), zapotrzebowanieMiesiaceKwh: [24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], pojemnoscKwh: 100, sprawnoscCyklu: 1 }
    const b = bilansGodzinowy(w)
    expect(suma(b.zBateriiMiesiaceKwh)).toBeCloseTo(23, 10)
    expect(suma(b.brakMiesiaceKwh)).toBeCloseTo(0, 10)
    expect(suma(b.odcieteMiesiaceKwh)).toBeCloseTo(0, 10)
  })

  it("brak z godzin taniej strefy (22–6): 8 godzin doby · 1 kWh", () => {
    const b = bilansGodzinowy({ ...doby(2), pojemnoscKwh: 0, sprawnoscCyklu: null, oknaTanie: [{ odH: 22, doH: 6 }] })
    expect(suma(b.brakTaniaMiesiaceKwh)).toBeCloseTo(16, 10)
  })

  it("miesiąc bez rekordów w TMY nie psuje bilansu (zużycie tego miesiąca pomijane)", () => {
    const b = bilansGodzinowy({ ...doby(1), zapotrzebowanieMiesiaceKwh: [24, 999, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], pojemnoscKwh: 0, sprawnoscCyklu: null })
    expect(suma(b.zuzycieMiesiaceKwh)).toBeCloseTo(24, 10)
  })
})

describe("podsumujBilans", () => {
  it("rok i zima XI–II osobno, pokrycie, cykle baterii", () => {
    // styczeń (zima) i lipiec (lato) po jednej dobie; pomijamy rzeczywiste kWh, sprawdzamy sumowanie
    const n = 48
    const miesiac = new Uint8Array(n)
    miesiac.fill(6, 24)
    const produkcjaKwh = new Float64Array(n)
    for (const d of [0, 1]) for (let h = 10; h <= 13; h++) produkcjaKwh[d * 24 + h] = 2
    const b = bilansGodzinowy({
      produkcjaKwh,
      miesiac,
      godzinaLokalna: Uint8Array.from({ length: n }, (_, i) => i % 24),
      zapotrzebowanieMiesiaceKwh: [24, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0],
      pojemnoscKwh: 4,
      sprawnoscCyklu: 1,
    })
    const p = podsumujBilans(b)
    // each day: direct 4, battery 4 (from 4 kWh surplus), brak 16
    expect(p.zuzycieRokKwh).toBeCloseTo(48, 10)
    expect(p.zuzycieZimaKwh).toBeCloseTo(24, 10)
    expect(p.brakRokKwh).toBeCloseTo(32, 10)
    expect(p.brakZimaKwh).toBeCloseTo(16, 10)
    expect(p.pokrycieRokPct).toBeCloseTo((16 / 48) * 100, 10)
    expect(p.pokrycieZimaPct).toBeCloseTo((8 / 24) * 100, 10)
    expect(p.cykleRok).toBeCloseTo(8 / 4, 10)
  })

  it("bez baterii: brak cykli; bez zużycia: brak procentu pokrycia", () => {
    const bez = podsumujBilans(bilansGodzinowy({ ...doby(1), pojemnoscKwh: 0, sprawnoscCyklu: null }))
    expect(bez.cykleRok).toBeNull()
    const zero = podsumujBilans(bilansGodzinowy({ ...doby(1), zapotrzebowanieMiesiaceKwh: new Array(12).fill(0), pojemnoscKwh: 5, sprawnoscCyklu: 1 }))
    expect(zero.pokrycieRokPct).toBeNull()
  })
})

// ───────── integracja z silnikiem Porównywarki ─────────

const rok = (): RekordGodzinowy[] => {
  const start = Date.UTC(2018, 0, 1)
  return Array.from({ length: 8760 }, (_, h) => {
    const czasUtcMs = start + h * 3_600_000
    const m = new Date(czasUtcMs).getUTCMonth()
    const dzien = (h % 24) >= 7 && (h % 24) <= 15
    const g = dzien ? (m === 0 || m === 11 ? 200 : m === 6 ? 600 : 350) : 0
    return { czasUtcMs, ghi: g, dni: 0, dhi: g, tempC: m === 0 ? -5 : 15 }
  })
}
const ja500: DanePanelu = { ...znajdzPanelKatalogu("ja-solar-jam60d41-lb-500")!, cenaBruttoZl: null }
const ZAPOTRZEBOWANIE = [200, 180, 170, 150, 140, 130, 130, 130, 140, 160, 180, 200]
const wejscie = (dodaj: Partial<PorownywarkaInput> = {}): PorownywarkaInput => ({
  szerokoscGeograficzna: 52.2,
  dlugoscGeograficzna: 21,
  daneGodzinowe: rok(),
  miejsce: { nachylenieDeg: 35, azymutDeg: 180, albedo: 0.2 },
  liczbaPaneli: 6,
  panele: [ja500],
  zapotrzebowanieMiesiaceKwh: ZAPOTRZEBOWANIE,
  wycena: { rodzaj: "reczna", zlKwh: 2 },
  kryteria: domyslnyWyborKryteriow(),
  ...dodaj,
})

describe("calculatePorownywarkaPaneli — bilans godzinowy (A5, spec 34)", () => {
  it("godzinowa energia panelu sumuje się do miesięcznej (jedno źródło wzoru)", () => {
    const profil = profilNaslonecznienia(52.2, 21, rok(), { nachylenieDeg: 35, azymutDeg: 180, albedo: 0.2 })
    const zakres = { temperatura: true, slabeSwiatlo: false }
    const godz = godzinowaEnergiaPanelu(ja500, profil, zakres)
    const mies = miesiecznaEnergiaPanelu(ja500, profil, zakres)
    const poMiesiacach = new Array<number>(12).fill(0)
    godz.forEach((e, i) => (poMiesiacach[profil.miesiac[i]!]! += e))
    poMiesiacach.forEach((e, m) => expect(e).toBeCloseTo(mies[m]!, 8))
  })

  it("bez ustawień bilansu albo bez zapotrzebowania: brak bilansu i brak założeń A5", () => {
    for (const r of [calculatePorownywarkaPaneli(wejscie()), calculatePorownywarkaPaneli(wejscie({ bilansGodzinowy: { pojemnoscKwh: 5, sprawnoscCyklu: 0.9 }, zapotrzebowanieMiesiaceKwh: null }))]) {
      expect(r.value.panele[0]!.bilansGodzinowy).toBeNull()
      expect(r.assumptions.some((a) => typeof a !== "string" && a.kod.startsWith("PORP-ZAL-BIL"))).toBe(false)
    }
  })

  it("bez baterii: bezpośrednie zużycie nie przekracza energii wykorzystanej z bilansu miesięcznego; zużycie roczne = suma zapotrzebowania", () => {
    const r = calculatePorownywarkaPaneli(wejscie({ bilansGodzinowy: { pojemnoscKwh: 0, sprawnoscCyklu: null } }))
    const p = r.value.panele[0]!
    const b = p.bilansGodzinowy!
    expect(b.zuzycieRokKwh).toBeCloseTo(ZAPOTRZEBOWANIE.reduce((a, c) => a + c, 0), 8)
    expect(b.bezposrednioRokKwh).toBeLessThanOrEqual(p.uzytecznaRokKwh! + 1e-9)
    expect(b.bezposrednioRokKwh).toBeGreaterThan(0)
    expect(b.zBateriiRokKwh).toBe(0)
    expect(b.bezposrednioRokKwh + b.brakRokKwh).toBeCloseTo(b.zuzycieRokKwh, 8)
  })

  it("większa bateria nie zmniejsza pokrycia ani nie zwiększa braku zimą i w roku", () => {
    const wynik = (c: number) => calculatePorownywarkaPaneli(wejscie({ bilansGodzinowy: { pojemnoscKwh: c, sprawnoscCyklu: 0.9 } })).value.panele[0]!.bilansGodzinowy!
    const [a, b, c] = [wynik(0), wynik(5), wynik(15)]
    expect(b.brakRokKwh).toBeLessThan(a.brakRokKwh)
    expect(c.brakRokKwh).toBeLessThanOrEqual(b.brakRokKwh + 1e-9)
    expect(c.brakZimaKwh).toBeLessThanOrEqual(b.brakZimaKwh + 1e-9)
    expect(c.pokrycieRokPct!).toBeGreaterThanOrEqual(b.pokrycieRokPct!)
  })

  it("koszt braku = brak × stawka przy stawce płaskiej; zima osobno", () => {
    const b = calculatePorownywarkaPaneli(wejscie({ bilansGodzinowy: { pojemnoscKwh: 5, sprawnoscCyklu: 0.9 } })).value.panele[0]!.bilansGodzinowy!
    expect(b.kosztBrakuRokZl).toBeCloseTo(b.brakRokKwh * 2, 8)
    expect(b.kosztBrakuZimaZl).toBeCloseTo(b.brakZimaKwh * 2, 8)
  })

  it("taryfa dzienna i nocna: brak z nocy liczony po cenie nocnej (decyzja B: wycena na energii brakującej)", () => {
    const wycena = { rodzaj: "dzienNoc" as const, zlKwhDzien: 1.2, zlKwhNoc: 0.6, oknaTanie: [{ odH: 22, doH: 6 }] }
    const b = calculatePorownywarkaPaneli(wejscie({ wycena, bilansGodzinowy: { pojemnoscKwh: 0, sprawnoscCyklu: null } })).value.panele[0]!.bilansGodzinowy!
    expect(b.brakTaniaRokKwh).toBeGreaterThan(0)
    expect(b.brakTaniaRokKwh).toBeLessThan(b.brakRokKwh)
    expect(b.kosztBrakuRokZl).toBeCloseTo((b.brakRokKwh - b.brakTaniaRokKwh) * 1.2 + b.brakTaniaRokKwh * 0.6, 8)
  })

  it("bez wyceny: brak kosztu, ale energia policzona", () => {
    const b = calculatePorownywarkaPaneli(wejscie({ wycena: null, bilansGodzinowy: { pojemnoscKwh: 5, sprawnoscCyklu: 1 } })).value.panele[0]!.bilansGodzinowy!
    expect(b.kosztBrakuRokZl).toBeNull()
    expect(b.brakRokKwh).toBeGreaterThan(0)
  })

  it("założenia: profil płaski, bez limitów mocy, dwa przebiegi; sprawność 100% tylko gdy nie podano i jest bateria", () => {
    const kody = (r: ReturnType<typeof calculatePorownywarkaPaneli>) => r.assumptions.map((a) => (typeof a === "string" ? a : a.kod))
    const z = kody(calculatePorownywarkaPaneli(wejscie({ bilansGodzinowy: { pojemnoscKwh: 5, sprawnoscCyklu: null } })))
    expect(z).toEqual(expect.arrayContaining(["PORP-ZAL-BIL-PROFIL-PLASKI", "PORP-ZAL-BIL-BEZ-LIMITOW-MOCY", "PORP-ZAL-BIL-DWA-PRZEBIEGI", "PORP-ZAL-BIL-CYKL-100"]))
    const p = kody(calculatePorownywarkaPaneli(wejscie({ bilansGodzinowy: { pojemnoscKwh: 5, sprawnoscCyklu: 0.9 } })))
    expect(p).toContain("PORP-ZAL-BIL-CYKL")
    expect(p).not.toContain("PORP-ZAL-BIL-CYKL-100")
    const bez = kody(calculatePorownywarkaPaneli(wejscie({ bilansGodzinowy: { pojemnoscKwh: 0, sprawnoscCyklu: null } })))
    expect(bez).not.toContain("PORP-ZAL-BIL-CYKL-100")
  })

  it("niepoprawne ustawienia: ujemna pojemność i sprawność poza (0–1] to błąd walidacji", () => {
    const r1 = calculatePorownywarkaPaneli(wejscie({ bilansGodzinowy: { pojemnoscKwh: -1, sprawnoscCyklu: null } }))
    expect(r1.status).toBe("INVALID_INPUT")
    const r2 = calculatePorownywarkaPaneli(wejscie({ bilansGodzinowy: { pojemnoscKwh: 5, sprawnoscCyklu: 1.5 } }))
    expect(r2.warnings.map((w) => w.code)).toContain("PORP-SPRAWNOSC-CYKLU-POZA-ZAKRESEM")
  })
})
