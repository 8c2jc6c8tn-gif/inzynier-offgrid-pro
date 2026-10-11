import { describe, expect, it } from "vitest"
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"
import { calculatePorownywarkaPaneli } from "../calculator"
import { domyslnyWyborKryteriow } from "../kryteria"
import type { DanePanelu, PorownywarkaInput } from "../input"

/** Syntetyczny rok jak w `porownywarka-paneli.test.ts`: styczeń G = 200 W/m² (−5 °C), lipiec G = 600 W/m² (20 °C), reszta 0. */
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
  cenaBruttoZl: 600,
  gammaPctNaC: -0.29,
  noctC: 45,
  sprawnoscWzglednaPrzy200WPct: null,
  degradacjaPierwszyRokPct: null,
  degradacjaLiniowaPctNaRok: null,
  dlugoscMm: null,
  szerokoscMm: null,
  masaKg: null,
  bifacjalny: false,
  ...p,
})

const wejscie = (panele: DanePanelu[], reszta: Partial<PorownywarkaInput> = {}): PorownywarkaInput => ({
  szerokoscGeograficzna: 52.2,
  dlugoscGeograficzna: 21,
  daneGodzinowe: rok(),
  miejsce: { nachylenieDeg: 0, azymutDeg: 180, albedo: 0.2 },
  liczbaPaneli: 2,
  panele,
  wycena: { rodzaj: "siec", zlKwh: 1 },
  kryteria: domyslnyWyborKryteriow(),
  ...reszta,
})

describe("test zaniżenia mocy panelu (spec 38)", () => {
  it("bez wpisanego procentu: brak scenariusza, główne wyniki jak dotąd", () => {
    const w = calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })]))
    expect(w.value.panele[0]!.zanizenieMocy).toBeNull()
  })

  it("zgadza się z niezależnym przeliczeniem: panel o mocy pomniejszonej o X% daje te same energie i koszty", () => {
    const x = 20
    const z = calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })], { testZanizeniaMocyPct: x })).value.panele[0]!
    const odniesienie = calculatePorownywarkaPaneli(wejscie([panel({ id: "A", pmaxW: 500 * (1 - x / 100) })])).value.panele[0]!
    const s = z.zanizenieMocy!
    expect(s.zanizeniePct).toBe(20)
    expect(s.mocKwp).toBeCloseTo(odniesienie.mocKwp, 10)
    expect(s.zimaKwh).toBeCloseTo(odniesienie.zimaKwh, 8)
    expect(s.rokKwh).toBeCloseTo(odniesienie.rokKwh, 8)
    expect(s.wartoscRokZl!).toBeCloseTo(odniesienie.wartoscRokZl!, 8)
    // Cena nie spada razem z mocą: to ta sama cena za mniej energii, więc koszt zimowej kWh rośnie o 1/(1−X).
    expect(s.kosztZimowejKwhZl!).toBeCloseTo(z.kosztZimowejKwhZl! / 0.8, 8)
    expect(s.okresZwrotuLat!).toBeCloseTo(z.okresZwrotuLat! / 0.8, 8)
    // Cena za Wp rzeczywistej mocy: 600 zł / (500 W × 0,8) = 1,5 zł/Wp wobec 1,2 zł/Wp z karty.
    expect(z.cenaZaWpZl).toBeCloseTo(1.2, 10)
    expect(s.cenaZaWpZl).toBeCloseTo(1.5, 10)
  })

  it("główne wyniki nie zależą od testu", () => {
    const bez = calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })])).value.panele[0]!
    const z = calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })], { testZanizeniaMocyPct: 30 })).value.panele[0]!
    expect(z.rokKwh).toBe(bez.rokKwh)
    expect(z.zimaKwh).toBe(bez.zimaKwh)
    expect(z.wartoscRokZl).toBe(bez.wartoscRokZl)
  })

  it("bez ceny: koszt, zwrot i cena za Wp to null, energia policzona", () => {
    const s = calculatePorownywarkaPaneli(wejscie([panel({ id: "A", cenaBruttoZl: null })], { testZanizeniaMocyPct: 10 })).value.panele[0]!.zanizenieMocy!
    expect(s.kosztZimowejKwhZl).toBeNull()
    expect(s.okresZwrotuLat).toBeNull()
    expect(s.cenaZaWpZl).toBeNull()
    expect(s.zimaKwh).toBeGreaterThan(0)
  })

  it("z zapotrzebowaniem: użyteczna energia nie rośnie, bo zaniżenie nie podnosi produkcji", () => {
    const zap = Array.from({ length: 12 }, () => 30)
    const w = calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })], { testZanizeniaMocyPct: 25, zapotrzebowanieMiesiaceKwh: zap })).value.panele[0]!
    expect(w.zanizenieMocy!.uzytecznaRokKwh!).toBeLessThanOrEqual(w.uzytecznaRokKwh!)
  })

  it.each([0, -5, 100, 150, Number.NaN])("wartość %s jest błędem danych", (x) => {
    const w = calculatePorownywarkaPaneli(wejscie([panel({ id: "A" })], { testZanizeniaMocyPct: x }))
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.warnings.map((e) => e.code)).toContain("PORP-ZANIZENIE-MOCY-POZA-ZAKRESEM")
  })
})
