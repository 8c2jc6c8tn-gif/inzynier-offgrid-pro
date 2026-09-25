import { describe, expect, it } from "vitest"
import type { TabelaNapromieniowania } from "../../kat-i-azymut/input"
import { calculateZlotySrodek } from "../calculator"
import { PRZYSPIESZENIE_ZIEMSKIE_M_S2 } from "../constants"
import type { ZlotySrodekInput } from "../input"

/** Syntetyczna tabela (NIE dane klimatyczne): roczna suma = 1200 − 0,2·(α − 38)², równo na 12 miesięcy. */
const rocznie = (kat: number) => 1200 - 0.2 * (kat - 38) ** 2
const tabela: TabelaNapromieniowania = {
  azymutDeg: 180,
  albedo: 0.2,
  katyDeg: Array.from({ length: 91 }, (_, k) => k),
  miesiace: Array.from({ length: 91 }, (_, k) => Array<number>(12).fill(rocznie(k) / 12)),
}

const bazowe: ZlotySrodekInput = {
  tabela,
  strefaWiatrowa: 1,
  wysokoscNpmM: 100,
  kategoriaTerenu: "III",
  wysokoscKonstrukcjiM: 2,
  powierzchniaPaneliM2: 10,
  wspolczynnikPhi: 0,
  cenaBalastuZlKg: 1,
  mocInstalacjiKwp: null,
  wspolczynnikPr: null,
  cenaEnergiiZlKwh: null,
  liczbaLat: null,
  nachylenieDeg: null,
}
const qp = 300 * 1.9 * 0.5 ** 0.26
const kody = (r: ReturnType<typeof calculateZlotySrodek>) => r.warnings.map((w) => w.code)

describe("calculateZlotySrodek (M3/E9, D27)", () => {
  it("brak tabeli albo danych wiatru → INCOMPLETE, bez wartości domyślnych", () => {
    expect(calculateZlotySrodek({ ...bazowe, tabela: null }).status).toBe("INCOMPLETE")
    expect(calculateZlotySrodek({ ...bazowe, strefaWiatrowa: null }).status).toBe("INCOMPLETE")
    expect(calculateZlotySrodek({ ...bazowe, wspolczynnikPhi: null }).status).toBe("INCOMPLETE")
    expect(calculateZlotySrodek({ ...bazowe, cenaBalastuZlKg: null }).status).toBe("INCOMPLETE")
  })

  it("tor wiatru: qp = ce·qb; przy 30° (φ = 0) Fw = 1,8·qp·A, balast = Fw/g, koszt = kg × cena", () => {
    const r = calculateZlotySrodek({ ...bazowe, cenaBalastuZlKg: 2 })
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    expect(r.value!.qpPa).toBeCloseTo(qp, 6)
    const p30 = r.value!.punkty[30]!
    expect(p30.silaWiatruN).toBeCloseTo(1.8 * qp * 10, 6)
    expect(p30.balastKg).toBeCloseTo((1.8 * qp * 10) / PRZYSPIESZENIE_ZIEMSKIE_M_S2, 6)
    expect(p30.kosztBalastuZl).toBeCloseTo(p30.balastKg! * 2, 6)
  })

  it("31–89° bez danych wiatru; 90° — siła pozioma cf = 1,80, bez balastu", () => {
    const r = calculateZlotySrodek(bazowe).value!
    expect(r.punkty[45]!.silaWiatruN).toBeNull()
    expect(r.punkty[90]!.cf).toBe(1.8)
    expect(r.punkty[90]!.balastKg).toBeNull()
    expect(r.punkty[90]!.procentSilyMaks).toBeCloseTo(100, 9)
    expect(r.punkty[0]!.procentSilyMaks).toBeCloseTo((100 * 0.5) / 1.8, 9)
  })

  it("śnieg: μ1 z Tablicy 5.2 w każdym punkcie", () => {
    const r = calculateZlotySrodek(bazowe).value!
    expect(r.punkty[20]!.mu1).toBe(0.8)
    expect(r.punkty[45]!.mu1).toBeCloseTo(0.4, 9)
  })

  it("bez wyceny energii: brak rekomendacji + info; ostrzeżenie o braku PN-EN 1990 zawsze", () => {
    const r = calculateZlotySrodek(bazowe)
    expect(r.value!.rekomendacjaDeg).toBeNull()
    expect(r.value!.optimumEnergiiDeg).toBe(38)
    expect(kody(r)).toEqual([
      "ZS-BALAST-BEZ-WSPOLCZYNNIKOW",
      "ZS-REKOMENDACJA-WYMAGA-WYCENY",
      "ZS-OPTIMUM-ENERGII-POZA-ZAKRESEM-WIATRU",
    ])
  })

  it("rekomendacja = max(wartość energii − koszt balastu) w 0–30°; droższy balast → mniejszy kąt", () => {
    const wycena = { mocInstalacjiKwp: 2, wspolczynnikPr: 0.8, cenaEnergiiZlKwh: 1, liczbaLat: 10 }
    const tani = calculateZlotySrodek({ ...bazowe, ...wycena, cenaBalastuZlKg: 0 }).value!
    expect(tani.rekomendacjaDeg).toBe(30)
    const drogi = calculateZlotySrodek({ ...bazowe, ...wycena, cenaBalastuZlKg: 50 }).value!
    expect(drogi.rekomendacjaDeg).toBeLessThan(30)
    // Sprawdzenie ręczne kryterium w punkcie rekomendacji.
    const p = drogi.punkty[drogi.rekomendacjaDeg!]!
    expect(p.bilansZl).toBeCloseTo(2 * rocznie(p.nachylenieDeg) * 0.8 * 10 - p.balastKg! * 50, 6)
    const najlepszy = Math.max(...drogi.punkty.filter((q) => q.bilansZl !== null).map((q) => q.bilansZl!))
    expect(p.bilansZl).toBe(najlepszy)
  })

  it("wybrany kąt 45° → info o braku danych; 90° → info o sile poziomej", () => {
    expect(kody(calculateZlotySrodek({ ...bazowe, nachylenieDeg: 45 }))).toContain("ZS-KAT-BEZ-DANYCH-WIATRU")
    expect(kody(calculateZlotySrodek({ ...bazowe, nachylenieDeg: 90 }))).toContain("ZS-PION-SILA-POZIOMA")
  })

  it("błędne dane → INVALID_INPUT", () => {
    expect(calculateZlotySrodek({ ...bazowe, wspolczynnikPhi: 1.5 }).status).toBe("INVALID_INPUT")
    expect(calculateZlotySrodek({ ...bazowe, powierzchniaPaneliM2: 0 }).status).toBe("INVALID_INPUT")
    expect(calculateZlotySrodek({ ...bazowe, cenaBalastuZlKg: -1 }).status).toBe("INVALID_INPUT")
    expect(calculateZlotySrodek({ ...bazowe, strefaWiatrowa: 3, wysokoscNpmM: 20000 }).status).toBe("INVALID_INPUT")
  })
})
