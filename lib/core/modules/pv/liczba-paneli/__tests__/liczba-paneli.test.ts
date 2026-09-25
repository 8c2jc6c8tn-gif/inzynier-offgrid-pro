import { describe, expect, it } from "vitest"
import type { TabelaNapromieniowania } from "../../kat-i-azymut/input"
import { calculateLiczbaPaneli } from "../calculator"
import { DNI_W_MIESIACU } from "../constants"
import type { LiczbaPaneliInput } from "../input"

/**
 * Syntetyczna tabela (NIE dane klimatyczne): miesiąc m przy kącie k ma H = baza[m]·(1 + 0,01·k·zima[m]),
 * gdzie zima[m] = +1 dla lis–lut (stromiej lepiej), −1 dla reszty (płasko lepiej).
 */
const BAZA = [20, 40, 80, 120, 150, 160, 160, 140, 100, 60, 25, 15]
const ZIMA = [1, 1, -1, -1, -1, -1, -1, -1, -1, -1, 1, 1]
const tabela: TabelaNapromieniowania = {
  azymutDeg: 180,
  albedo: 0.2,
  katyDeg: Array.from({ length: 91 }, (_, k) => k),
  miesiace: Array.from({ length: 91 }, (_, k) => BAZA.map((b, m) => b * (1 + 0.01 * k * ZIMA[m]!))),
}

const bazowe: LiczbaPaneliInput = {
  tabela,
  nachylenieDeg: 0,
  stelazRegulowany: false,
  mocPaneluWp: 500,
  powierzchniaPaneluM2: 2,
  wspolczynnikPr: 0.8,
  zapotrzebowanieDoboweKwh: 4,
  dodatkoweZimaKwhDzien: 0,
  miesiaceGrzewcze: [],
  limitMontazowy: 30,
}
// Przy 0°: produkcja panelu = 0,5 × H × 0,8 = 0,4·H [kWh].
const nDla = (m: number, dob = 4) => Math.ceil((DNI_W_MIESIACU[m]! * dob) / (0.4 * BAZA[m]!))

describe("calculateLiczbaPaneli (M3/E4, D25)", () => {
  it("brak danych → INCOMPLETE (bez domyślnego PR, zapotrzebowania ani kąta)", () => {
    expect(calculateLiczbaPaneli({ ...bazowe, wspolczynnikPr: null }).status).toBe("INCOMPLETE")
    expect(calculateLiczbaPaneli({ ...bazowe, zapotrzebowanieDoboweKwh: null }).status).toBe("INCOMPLETE")
    expect(calculateLiczbaPaneli({ ...bazowe, nachylenieDeg: null }).status).toBe("INCOMPLETE")
    expect(calculateLiczbaPaneli({ ...bazowe, dodatkoweZimaKwhDzien: null }).status).toBe("INCOMPLETE")
  })

  it("N okresu = ⌈max(zapotrzebowanie/produkcja)⌉, miesiąc decydujący z danych (tu grudzień / sierpień)", () => {
    const r = calculateLiczbaPaneli(bazowe).value!
    const [lato, marPaz, lutLis, rok] = r.warianty
    expect(lato!.liczbaPaneli).toBe(Math.max(nDla(5), nDla(6), nDla(7)))
    expect(lato!.miesiacDecydujacy).toBe(7)
    expect(marPaz!.miesiacDecydujacy).toBe(9)
    expect(lutLis!.miesiacDecydujacy).toBe(10)
    expect(rok!.miesiacDecydujacy).toBe(11)
    expect(rok!.liczbaPaneli).toBe(nDla(11))
    expect(rok!.mocKwp).toBeCloseTo((rok!.liczbaPaneli! * 500) / 1000, 9)
    expect(rok!.powierzchniaM2).toBe(rok!.liczbaPaneli! * 2)
  })

  it("rekomendacja = najszerszy okres w limicie; deficyt liczony dla jej N", () => {
    // N: lato 3, mar–paź 6, lut–lis 12, rok 21 (przy 4 kWh/dzień, 0°).
    const r = calculateLiczbaPaneli({ ...bazowe, limitMontazowy: 15 })
    const v = r.value!
    expect(v.rekomendacja).toBe("lutLis")
    expect(v.liczbaPaneliDeficytu).toBe(v.warianty[2]!.liczbaPaneli)
    expect(v.deficytMiesiecznyKwh![11]).toBeCloseTo(31 * 4 - v.liczbaPaneliDeficytu! * 0.4 * 15, 9)
    expect(v.deficytMiesiecznyKwh![6]).toBe(0)
    expect(r.warnings.map((w) => w.code)).toEqual(["LP-DEFICYT-POZA-OKRESEM"])
    expect(r.status).toBe("VALID")
  })

  it("limit mniejszy niż lato → ostrzeżenie; deficyt przy pełnym limicie", () => {
    const r = calculateLiczbaPaneli({ ...bazowe, limitMontazowy: 2 })
    expect(r.value!.rekomendacja).toBeNull()
    expect(r.value!.liczbaPaneliDeficytu).toBe(2)
    expect(r.warnings.map((w) => w.code)).toContain("LP-LIMIT-ZA-MALY-NAWET-LATO")
    expect(r.status).toBe("VALID_WITH_WARNINGS")
  })

  it("dodatkowe zapotrzebowanie zimą doliczane tylko w wybranych miesiącach", () => {
    const r = calculateLiczbaPaneli({ ...bazowe, dodatkoweZimaKwhDzien: 10, miesiaceGrzewcze: [0, 11] }).value!
    expect(r.zapotrzebowanieMiesieczneKwh[11]).toBe(31 * 14)
    expect(r.zapotrzebowanieMiesieczneKwh[1]).toBe(28 * 4)
    expect(r.warianty[3]!.liczbaPaneli).toBe(nDla(11, 14))
  })

  it("stelaż regulowany → optimum każdego miesiąca (zima 90°, lato 0°), mniej paneli na cały rok", () => {
    const staly = calculateLiczbaPaneli(bazowe).value!
    const reg = calculateLiczbaPaneli({ ...bazowe, stelazRegulowany: true, nachylenieDeg: null }).value!
    expect(reg.katMiesiacaDeg[11]).toBe(90)
    expect(reg.katMiesiacaDeg[6]).toBe(0)
    expect(reg.warianty[3]!.liczbaPaneli!).toBeLessThan(staly.warianty[3]!.liczbaPaneli!)
  })

  it("miesiąc bez produkcji → okres niewykonalny (null) z ostrzeżeniem", () => {
    const ciemno = { ...tabela, miesiace: tabela.miesiace.map((w) => w.map((h, m) => (m === 11 ? 0 : h))) }
    const r = calculateLiczbaPaneli({ ...bazowe, tabela: ciemno })
    expect(r.value!.warianty[3]!.liczbaPaneli).toBeNull()
    expect(r.warnings.map((w) => w.code)).toContain("LP-OKRES-BEZ-PRODUKCJI")
  })

  it("błędne dane → INVALID_INPUT", () => {
    expect(calculateLiczbaPaneli({ ...bazowe, dodatkoweZimaKwhDzien: 5, miesiaceGrzewcze: [] }).status).toBe("INVALID_INPUT")
    expect(calculateLiczbaPaneli({ ...bazowe, limitMontazowy: 2.5 }).status).toBe("INVALID_INPUT")
    expect(calculateLiczbaPaneli({ ...bazowe, miesiaceGrzewcze: [12] }).status).toBe("INVALID_INPUT")
    expect(calculateLiczbaPaneli({ ...bazowe, wspolczynnikPr: 1.2 }).status).toBe("INVALID_INPUT")
  })
})
