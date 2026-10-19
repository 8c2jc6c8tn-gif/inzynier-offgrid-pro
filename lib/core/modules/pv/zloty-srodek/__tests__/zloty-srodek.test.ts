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
  masaPaneliStelazaKg: null,
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

  it("tor wiatru: qp = ce·qb; przy 30° (φ = 0) Fw = 1,8·qp·A, balast EQU = 1,5·Fw/(0,9·g), koszt = kg × cena", () => {
    const r = calculateZlotySrodek({ ...bazowe, cenaBalastuZlKg: 2 })
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    expect(r.value!.qpPa).toBeCloseTo(qp, 6)
    const p30 = r.value!.punkty[30]!
    expect(p30.silaWiatruN).toBeCloseTo(1.8 * qp * 10, 6)
    expect(p30.balastKg).toBeCloseTo((1.5 * 1.8 * qp * 10) / (0.9 * PRZYSPIESZENIE_ZIEMSKIE_M_S2), 6)
    expect(p30.kosztBalastuZl).toBeCloseTo(p30.balastKg! * 2, 6)
  })

  it("D29: masa paneli i stelaża odejmowana od balastu i jego kosztu; większa niż wymagana → 0", () => {
    const bez = calculateZlotySrodek({ ...bazowe, cenaBalastuZlKg: 2 })
    expect(bez.assumptions).toContainEqual({ kod: "ZS-ZALOZENIE-MASA-WLASNA-POMINIETA" })
    const r = calculateZlotySrodek({ ...bazowe, cenaBalastuZlKg: 2, masaPaneliStelazaKg: 100 })
    const p30 = r.value!.punkty[30]!
    expect(p30.balastKg).toBeCloseTo(bez.value!.punkty[30]!.balastKg! - 100, 9)
    expect(p30.kosztBalastuZl).toBeCloseTo(p30.balastKg! * 2, 9)
    expect(r.value!.punkty[0]!.balastKg).toBe(Math.max(0, bez.value!.punkty[0]!.balastKg! - 100))
    expect(r.assumptions).toContainEqual({ kod: "ZS-ZALOZENIE-MASA-WLASNA", params: { masa: 100, gammaG: 0.9 } })
    expect(calculateZlotySrodek({ ...bazowe, masaPaneliStelazaKg: -1 }).status).toBe("INVALID_INPUT")
  })

  it("31–89°: siła i balast jako SZACUNEK (cf z 30°, 🔎); 90° — siła pozioma cf = 1,80, bez balastu", () => {
    const r = calculateZlotySrodek(bazowe).value!
    expect(r.punkty[30]!.szacunek).toBe(false) // do 30° to norma
    expect(r.punkty[45]!.szacunek).toBe(true)
    expect(r.punkty[45]!.cf).toBe(1.8)
    expect(r.punkty[45]!.silaWiatruN).toBeCloseTo(1.8 * qp * 10, 6)
    expect(r.punkty[45]!.balastKg).toBeCloseTo((1.5 * 1.8 * qp * 10) / (0.9 * PRZYSPIESZENIE_ZIEMSKIE_M_S2), 6)
    expect(r.punkty[89]!.szacunek).toBe(true)
    expect(r.punkty[90]!.szacunek).toBe(false)
    expect(r.punkty[90]!.cf).toBe(1.8)
    expect(r.punkty[90]!.balastKg).toBeNull()
    expect(r.punkty[90]!.procentSilyMaks).toBeCloseTo(100, 9)
    expect(r.punkty[45]!.procentSilyMaks).toBeCloseTo(100, 9) // ten sam cf co przy 90°, ten sam qp
    expect(r.punkty[0]!.procentSilyMaks).toBeCloseTo((100 * 0.5) / 1.8, 9)
  })

  it("śnieg: μ1 z Tablicy 5.2 w każdym punkcie", () => {
    const r = calculateZlotySrodek(bazowe).value!
    expect(r.punkty[20]!.mu1).toBe(0.8)
    expect(r.punkty[45]!.mu1).toBeCloseTo(0.4, 9)
  })

  it("bez wyceny energii: brak rekomendacji + info; ostrzeżenie o zakresie balastu EQU zawsze", () => {
    const r = calculateZlotySrodek(bazowe)
    expect(r.value!.rekomendacjaDeg).toBeNull()
    expect(r.value!.optimumEnergiiDeg).toBe(38)
    expect(kody(r)).toEqual([
      "ZS-BALAST-EQU-TYLKO-ODRYWANIE",
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

  it("wybrany kąt 45° → ostrzeżenie o szacunku i własnej odpowiedzialności; 90° → info o sile poziomej", () => {
    const k45 = kody(calculateZlotySrodek({ ...bazowe, nachylenieDeg: 45 }))
    expect(k45).toContain("WP30-KAT-NA-WLASNA-ODPOWIEDZIALNOSC")
    expect(k45).not.toContain("ZS-PION-SILA-POZIOMA")
    expect(kody(calculateZlotySrodek({ ...bazowe, nachylenieDeg: 90 }))).toContain("ZS-PION-SILA-POZIOMA")
    expect(kody(calculateZlotySrodek({ ...bazowe, nachylenieDeg: 20 }))).not.toContain("WP30-KAT-NA-WLASNA-ODPOWIEDZIALNOSC")
  })

  it("rekomendacja zostaje w zakresie normy; kąt z szacunkiem o wyższym bilansie to tylko informacja", () => {
    const wycena = { mocInstalacjiKwp: 2, wspolczynnikPr: 0.8, cenaEnergiiZlKwh: 1, liczbaLat: 10 }
    const r = calculateZlotySrodek({ ...bazowe, ...wycena, cenaBalastuZlKg: 0 })
    const v = r.value!
    expect(v.rekomendacjaDeg).toBe(30) // 38° dałoby więcej, ale to szacunek poza normą
    expect(v.szacunekLepszyDeg).toBe(38)
    const info = r.warnings.find((w) => w.code === "ZS-SZACUNEK-LEPSZY-BILANS")!
    expect(info.level).toBe("info")
    expect(info.params!.kat).toBe(38)
    // bez wyceny nie ma bilansu, więc i porównania
    expect(calculateZlotySrodek(bazowe).value!.szacunekLepszyDeg).toBeNull()
  })

  it("błędne dane → INVALID_INPUT", () => {
    expect(calculateZlotySrodek({ ...bazowe, wspolczynnikPhi: 1.5 }).status).toBe("INVALID_INPUT")
    expect(calculateZlotySrodek({ ...bazowe, powierzchniaPaneliM2: 0 }).status).toBe("INVALID_INPUT")
    expect(calculateZlotySrodek({ ...bazowe, cenaBalastuZlKg: -1 }).status).toBe("INVALID_INPUT")
    expect(calculateZlotySrodek({ ...bazowe, strefaWiatrowa: 3, wysokoscNpmM: 20000 }).status).toBe("INVALID_INPUT")
  })
})

describe("calculateZlotySrodek — przesuw i przewracanie (szacunek, dane od użytkownika)", () => {
  const g = PRZYSPIESZENIE_ZIEMSKIE_M_S2
  const zTarciem: ZlotySrodekInput = { ...bazowe, dlugoscWzdluzSpaduM: 2, wspolczynnikTarcia: 0.5 }

  it("bez długości i tarcia balast to tylko oderwanie (jak dotąd)", () => {
    const r = calculateZlotySrodek(bazowe)
    expect(r.value!.punkty.every((p) => !p.statecznosc)).toBe(true)
    expect(kody(r)).toContain("ZS-BALAST-EQU-TYLKO-ODRYWANIE")
  })

  it("z długością i tarciem: balast każdego kąta = max(oderwanie, przesuw, przewracanie), nigdy mniej niż samo oderwanie", () => {
    const bez = calculateZlotySrodek(bazowe).value!
    const r = calculateZlotySrodek(zTarciem)
    const v = r.value!
    const p = v.punkty[20]!
    const F = p.silaWiatruN!
    const rad = (20 * Math.PI) / 180
    const Fh = F * Math.sin(rad)
    const Fv = F * Math.cos(rad)
    const h = 2 - Math.sin(rad) // ze − L/2·sin α
    const b = 2 * Math.cos(rad)
    const oderwanie = (1.5 * F) / (0.9 * g)
    const przesuw = (1.5 * (Fh / 0.5 + Fv)) / (0.9 * g)
    const przewracanie = (1.5 * (Fv + (2 * Fh * h) / b)) / (0.9 * g)
    expect(p.statecznosc).toBe(true)
    expect(p.balastKg).toBeCloseTo(Math.max(oderwanie, przesuw, przewracanie), 6)
    for (const [i, q] of v.punkty.entries()) if (q.balastKg !== null) expect(q.balastKg).toBeGreaterThanOrEqual(bez.punkty[i]!.balastKg ?? 0)
    expect(kody(r)).toContain("WP30-STATECZNOSC-SZACUNEK-KATY")
    expect(kody(r)).not.toContain("ZS-BALAST-EQU-TYLKO-ODRYWANIE")
    expect(r.assumptions).toContainEqual({ kod: "WP30-ZALOZENIE-STATECZNOSC-KATY", params: { mu: 0.5, dlugosc: 2 } })
  })

  it("90°: bez głębokości podstawy brak balastu (rzut = 0), z głębokością jest liczba z przesuwu i przewracania", () => {
    expect(calculateZlotySrodek(zTarciem).value!.punkty[90]!.balastKg).toBeNull()
    const p = calculateZlotySrodek({ ...zTarciem, glebokoscPodstawyM: 0.8 }).value!.punkty[90]!
    const F = p.silaWiatruN!
    expect(p.statecznosc).toBe(true)
    // h = ze − L/2 = 1, bo sin 90° = 1
    expect(p.balastKg).toBeCloseTo(Math.max((1.5 * (F / 0.5)) / (0.9 * g), (1.5 * ((2 * F * 1) / 0.8)) / (0.9 * g)), 6)
  })

  it("kąt, dla którego środek paneli wypada pod gruntem (L za duża względem ze), zostaje na samym oderwaniu", () => {
    const p = calculateZlotySrodek({ ...zTarciem, dlugoscWzdluzSpaduM: 10 }).value!.punkty[30]!
    expect(p.statecznosc).toBe(false)
    expect(p.balastKg).not.toBeNull()
  })

  it("niedodatnie tarcie, długość albo głębokość → INVALID_INPUT", () => {
    expect(calculateZlotySrodek({ ...zTarciem, wspolczynnikTarcia: 0 }).status).toBe("INVALID_INPUT")
    expect(calculateZlotySrodek({ ...zTarciem, dlugoscWzdluzSpaduM: -1 }).status).toBe("INVALID_INPUT")
    expect(calculateZlotySrodek({ ...zTarciem, glebokoscPodstawyM: 0 }).status).toBe("INVALID_INPUT")
  })
})
