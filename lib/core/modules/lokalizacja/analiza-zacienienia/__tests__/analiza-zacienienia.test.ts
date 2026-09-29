import { describe, expect, it } from "vitest"
import { calculateAnalizaZacienienia } from "../calculator"
import type { AnalizaZacienieniaInput, PrzeszkodaBryla, PrzeszkodaDrzewo } from "../input"
import { katPrzeszkodyDeg, profilHoryzontuDeg } from "../przeszkody"
import {
  pozycjaSlonca,
  promieniowanieBezposrednieCzysteNiebo,
} from "@/lib/core/modules/lokalizacja/geometria-slonca/pozycja-slonca"
import { calculateOrientacjaPowierzchni } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/calculator"
import type { RekordGodzinowy } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/input"
import { natezenieGodziny, plaszczyzna, przygotujGodziny } from "@/lib/core/modules/lokalizacja/orientacja-powierzchni/muneer"

const DEG = 180 / Math.PI

const baza: AnalizaZacienieniaInput = {
  szerokoscGeograficzna: 52.2297,
  dlugoscGeograficzna: 21.0122,
  punkt: { x: 0, y: 0, z: 0 },
  nachyleniePowierzchniDeg: 35,
  azymutPowierzchniDeg: 180,
  przeszkody: [],
}

const drzewoPoludnie: PrzeszkodaDrzewo = {
  typ: "drzewo",
  nazwa: "Brzoza",
  srodek: { x: 0, y: -10 },
  promienKoronyM: 2,
  wysokoscM: 6,
}

const scianaPoludniowa: PrzeszkodaBryla = {
  typ: "bryla",
  nazwa: "Mur",
  obrys: [
    { x: -1000, y: -1 },
    { x: 1000, y: -1 },
    { x: 1000, y: -2 },
    { x: -1000, y: -2 },
  ],
  wysokoscM: 1000,
}

describe("katPrzeszkodyDeg — geometria analityczna", () => {
  it("drzewo na południu: odległość do krawędzi korony 8 m, wysokość 10 m → atan(10/8) = 51,34°", () => {
    const kat = katPrzeszkodyDeg({ x: 0, y: 0, z: 0 }, 180, { ...drzewoPoludnie, wysokoscM: 10 })
    expect(kat).toBeCloseTo(Math.atan(10 / 8) * DEG, 6)
  })

  it("drzewo na południu nie zasłania kierunku wschodniego", () => {
    expect(katPrzeszkodyDeg({ x: 0, y: 0, z: 0 }, 90, drzewoPoludnie)).toBe(0)
  })

  it("bryła: kwadrat 10 m na południu w odległości 10 m, wys. 5 m, punkt na 1 m → atan(4/10) = 21,80°", () => {
    const blok: PrzeszkodaBryla = {
      typ: "bryla",
      nazwa: "Stodoła",
      obrys: [
        { x: -5, y: -10 },
        { x: 5, y: -10 },
        { x: 5, y: -20 },
        { x: -5, y: -20 },
      ],
      wysokoscM: 5,
    }
    expect(katPrzeszkodyDeg({ x: 0, y: 0, z: 1 }, 180, blok)).toBeCloseTo(Math.atan(4 / 10) * DEG, 6)
  })

  it("przeszkoda niższa niż punkt analizy nie zacienia", () => {
    expect(katPrzeszkodyDeg({ x: 0, y: 0, z: 8 }, 180, drzewoPoludnie)).toBe(0)
  })
})

describe("calculateAnalizaZacienienia", () => {
  it("brak danych → INCOMPLETE", () => {
    expect(calculateAnalizaZacienienia({}).status).toBe("INCOMPLETE")
  })

  it("brak przeszkód → strata 0%, VALID", () => {
    const r = calculateAnalizaZacienienia(baza)
    expect(r.status).toBe("VALID")
    expect(r.value.obecnie.strataRocznaProcent).toBe(0)
    expect(r.value.obecnie.strataMiesiecznaProcent).toHaveLength(12)
  })

  it("mur 1000 m tuż na południu → niemal cała strata promieniowania bezpośredniego (> 90%)", () => {
    const r = calculateAnalizaZacienienia({ ...baza, przeszkody: [scianaPoludniowa] })
    expect(r.value.obecnie.strataRocznaProcent).toBeGreaterThan(90)
  })

  it("niska przeszkoda na północy nie zacienia panelu skierowanego na południe (< 0,5%)", () => {
    const r = calculateAnalizaZacienienia({
      ...baza,
      przeszkody: [{ ...drzewoPoludnie, nazwa: "Tuja", srodek: { x: 0, y: 10 }, wysokoscM: 3 }],
    })
    expect(r.value.obecnie.strataRocznaProcent).toBeLessThan(0.5)
  })

  it("drzewo na południu zacienia bardziej zimą (niskie słońce) niż latem", () => {
    const r = calculateAnalizaZacienienia({ ...baza, przeszkody: [drzewoPoludnie] })
    const [sty, , , , , cze] = r.value.obecnie.strataMiesiecznaProcent
    expect(sty!).toBeGreaterThan(cze!)
    expect(r.value.obecnie.strataRocznaProcent).toBeGreaterThan(0)
  })

  it("prognoza wzrostu drzewa → strata w prognozie większa niż obecnie", () => {
    const r = calculateAnalizaZacienienia({
      ...baza,
      latPrognozy: 10,
      przeszkody: [{ ...drzewoPoludnie, wysokoscPrognozowanaM: 14 }],
    })
    expect(r.value.prognoza).not.toBeNull()
    expect(r.value.prognoza!.strataRocznaProcent).toBeGreaterThan(r.value.obecnie.strataRocznaProcent)
    expect(r.assumptions).toContainEqual({ kod: "ZACIENIENIE-ZALOZENIE-PROGNOZA", params: { lata: 10 } })
  })

  it("udziały przeszkód sumują się do straty rocznej", () => {
    const r = calculateAnalizaZacienienia({
      ...baza,
      przeszkody: [drzewoPoludnie, { ...drzewoPoludnie, nazwa: "Dąb", srodek: { x: -8, y: -8 }, wysokoscM: 9 }],
    })
    const suma = r.value.obecnie.udzialPrzeszkod.reduce((a, u) => a + u.procent, 0)
    expect(suma).toBeCloseTo(r.value.obecnie.strataRocznaProcent, 9)
  })

  it("profil horyzontu: 360 wartości, maksimum w kierunku drzewa (~180°)", () => {
    const r = calculateAnalizaZacienienia({ ...baza, przeszkody: [drzewoPoludnie] })
    const profil = r.value.obecnie.profilHoryzontuDeg
    expect(profil).toHaveLength(360)
    expect(profil.indexOf(Math.max(...profil))).toBe(180)
  })

  it("punkt analizy wewnątrz korony drzewa → INVALID_INPUT", () => {
    const r = calculateAnalizaZacienienia({ ...baza, przeszkody: [{ ...drzewoPoludnie, srodek: { x: 0, y: 1 } }] })
    expect(r.status).toBe("INVALID_INPUT")
    expect(r.warnings[0]!.code).toBe("ZACIENIENIE-PUNKT-W-PRZESZKODZIE")
  })

  it("ujemna wysokość przeszkody → INVALID_INPUT", () => {
    const r = calculateAnalizaZacienienia({ ...baza, przeszkody: [{ ...drzewoPoludnie, wysokoscM: -1 }] })
    expect(r.status).toBe("INVALID_INPUT")
  })

  it("prognoza niższa niż obecna wysokość → ostrzeżenie, wynik nadal liczony", () => {
    const r = calculateAnalizaZacienienia({ ...baza, przeszkody: [{ ...drzewoPoludnie, wysokoscPrognozowanaM: 4 }] })
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    expect(r.warnings.map((w) => w.code)).toContain("ZACIENIENIE-PROGNOZA-NIZSZA")
  })

  it("nachylenie poza zakresem → INVALID_INPUT", () => {
    expect(calculateAnalizaZacienienia({ ...baza, nachyleniePowierzchniDeg: 120 }).status).toBe("INVALID_INPUT")
  })
})

/**
 * Syntetyczny rok godzinowy (NIE dane klimatyczne): DNI z modelu Meinela, stałe DHI przy słońcu nad
 * horyzontem, GHI = DNI·sin h + DHI; próbki HH:30. Tylko do sprawdzenia matematyki (jak test Ekranu 4).
 */
function rokSyntetyczny(lat: number, lon: number, dhiStale: number): RekordGodzinowy[] {
  const dane: RekordGodzinowy[] = []
  const start = Date.UTC(2026, 0, 1, 0, 30)
  for (let h = 0; h < 8760; h++) {
    const t = start + h * 3_600_000
    const p = pozycjaSlonca(lat, lon, t)
    const nad = p.wysokoscDeg > 0
    const dni = nad ? 1000 * promieniowanieBezposrednieCzysteNiebo(p.wysokoscDeg) : 0
    const dhi = nad ? dhiStale : 0
    dane.push({ czasUtcMs: t, dni, dhi, ghi: dni * Math.sin((p.wysokoscDeg * Math.PI) / 180) + dhi })
  }
  return dane
}

describe("strata całkowitego napromieniowania na danych TMY (TD14)", { timeout: 30_000 }, () => {
  const dane = rokSyntetyczny(baza.szerokoscGeograficzna!, baza.dlugoscGeograficzna!, 80)
  const tmy: AnalizaZacienieniaInput = { ...baza, daneGodzinowe: dane }

  it("bez przeszkód → 0%; źródło pvgis-tmy i założenia modelu Muneera + nieboskłonu", () => {
    const r = calculateAnalizaZacienienia(tmy)
    expect(r.value.zrodloPromieniowania).toBe("pvgis-tmy")
    expect(r.value.obecnie.strataRocznaProcent).toBe(0)
    expect(r.assumptions).toContainEqual({ kod: "ZACIENIENIE-ZALOZENIE-TMY-MUNEER", params: { albedo: 0.2 } })
    expect(r.assumptions).toContainEqual({ kod: "ZACIENIENIE-ZALOZENIE-NIEBOSKLON" })
    expect(r.assumptions).not.toContainEqual({ kod: "ZACIENIENIE-ZALOZENIE-BEZPOSREDNIE-CZYSTE-NIEBO" })
  })

  it("tożsamość: mur od południa zasłania każdą godzinę ze słońcem po jego stronie — strata = Σ(G − G_cień)/ΣG", () => {
    const r = calculateAnalizaZacienienia({ ...tmy, przeszkody: [scianaPoludniowa] })
    const pl = plaszczyzna(35, 180, 0.2)
    let suma = 0
    let strata = 0
    for (const g of przygotujGodziny(baza.szerokoscGeograficzna!, baza.dlugoscGeograficzna!, dane)) {
      const g0 = natezenieGodziny(g, pl, false)
      if (!(g0 > 0)) continue
      suma += g0
      const kat = katPrzeszkodyDeg(baza.punkt!, g.azymutDeg, scianaPoludniowa)
      if (g.wysokoscDeg > 0 && g.wysokoscDeg < kat) strata += g0 - natezenieGodziny(g, pl, true)
    }
    expect(r.value.obecnie.strataRocznaProcent).toBeCloseTo((100 * strata) / suma, 9)
    // Rozproszone jak dla zacienionej zostaje — strata całkowita < 100% mimo muru 1000 m.
    expect(r.value.obecnie.strataRocznaProcent).toBeLessThan(100)
  })

  it("zgodność z Ekranem 4: ta sama przeszkoda jako profil horyzontu daje tę samą stratę (± 0,2 p.p. — profil co 1°)", () => {
    const drzewo = { ...drzewoPoludnie, wysokoscM: 9 }
    const e3 = calculateAnalizaZacienienia({ ...tmy, przeszkody: [drzewo] }).value.obecnie.strataRocznaProcent
    const e4 = calculateOrientacjaPowierzchni({
      szerokoscGeograficzna: baza.szerokoscGeograficzna,
      dlugoscGeograficzna: baza.dlugoscGeograficzna,
      daneGodzinowe: dane,
      powierzchnie: [{ nazwa: "S35", nachylenieDeg: 35, azymutDeg: 180, horyzontyDeg: [profilHoryzontuDeg(baza.punkt!, [drzewo])] }],
    }).value.powierzchnie[0]!.strataZacienieniaProcent!
    expect(e3).toBeGreaterThan(0)
    expect(Math.abs(e3 - e4)).toBeLessThan(0.2)
  })

  it("udziały przeszkód sumują się do straty rocznej; miesiące w [0, 100]", () => {
    const r = calculateAnalizaZacienienia({ ...tmy, przeszkody: [drzewoPoludnie, { ...drzewoPoludnie, nazwa: "Lipa", srodek: { x: 8, y: -8 } }] })
    const o = r.value.obecnie
    expect(o.udzialPrzeszkod.reduce((a, u) => a + u.procent, 0)).toBeCloseTo(o.strataRocznaProcent, 9)
    for (const m of o.strataMiesiecznaProcent) {
      expect(m).toBeGreaterThanOrEqual(0)
      expect(m).toBeLessThanOrEqual(100)
    }
  })

  it("bez danych → wariant zapasowy czyste-niebo (jak dotąd)", () => {
    const r = calculateAnalizaZacienienia({ ...baza, przeszkody: [drzewoPoludnie] })
    expect(r.value.zrodloPromieniowania).toBe("czyste-niebo")
    expect(r.assumptions).toContainEqual({ kod: "ZACIENIENIE-ZALOZENIE-BEZPOSREDNIE-CZYSTE-NIEBO" })
  })

  it("niepełny rok danych → INVALID_INPUT (ta sama walidacja co Ekran 4)", () => {
    const r = calculateAnalizaZacienienia({ ...tmy, daneGodzinowe: dane.slice(0, 10) })
    expect(r.status).toBe("INVALID_INPUT")
    expect(r.warnings[0]!.code).toBe("ORIENTACJA-DANE-NIEPELNY-ROK")
  })
})

describe("drzewa liściaste w miesiącach bez liści (TD19)", () => {
  const ZIMA = [0, 1, 11]
  const lisciaste: PrzeszkodaDrzewo = { ...drzewoPoludnie, lisciaste: true }
  const dane = rokSyntetyczny(baza.szerokoscGeograficzna!, baza.dlugoscGeograficzna!, 80)

  for (const [wariant, wejscie] of [
    ["czyste niebo", baza],
    ["TMY", { ...baza, daneGodzinowe: dane }],
  ] as const) {
    it(`${wariant}: w miesiącach bez liści strata = (1 − 0,4) × strata drzewa nieprzezroczystego, w pozostałych bez zmian`, () => {
      const nieprzezr = calculateAnalizaZacienienia({ ...wejscie, przeszkody: [drzewoPoludnie] }).value.obecnie.strataMiesiecznaProcent
      const r = calculateAnalizaZacienienia({ ...wejscie, przeszkody: [lisciaste], miesiaceBezlisci: ZIMA })
      const m = r.value.obecnie.strataMiesiecznaProcent
      expect(nieprzezr[0]!).toBeGreaterThan(0)
      for (let i = 0; i < 12; i++) expect(m[i]!).toBeCloseTo(ZIMA.includes(i) ? 0.6 * nieprzezr[i]! : nieprzezr[i]!, 9)
    })
  }

  it("założenie z nazwami, miesiącami (od 1) i przepuszczalnością; bez założenia o nieprzezroczystych, gdy wszystkie liściaste", () => {
    const r = calculateAnalizaZacienienia({ ...baza, przeszkody: [lisciaste], miesiaceBezlisci: [11, 0, 1] })
    expect(r.assumptions).toContainEqual({
      kod: "ZACIENIENIE-ZALOZENIE-DRZEWA-LISCIASTE",
      params: { nazwy: "Brzoza", miesiace: "1, 2, 12", procent: 40 },
    })
    expect(r.assumptions).not.toContainEqual({ kod: "ZACIENIENIE-ZALOZENIE-DRZEWA-NIEPRZEZROCZYSTE" })
  })

  it("liściaste bez podanych miesięcy → jak nieprzezroczyste + ostrzeżenie", () => {
    const nieprzezr = calculateAnalizaZacienienia({ ...baza, przeszkody: [drzewoPoludnie] })
    const r = calculateAnalizaZacienienia({ ...baza, przeszkody: [lisciaste] })
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    expect(r.warnings.map((w) => w.code)).toContain("ZACIENIENIE-BRAK-OKRESU-BEZLISCI")
    expect(r.value.obecnie.strataRocznaProcent).toBe(nieprzezr.value.obecnie.strataRocznaProcent)
    expect(r.assumptions).toContainEqual({ kod: "ZACIENIENIE-ZALOZENIE-DRZEWA-NIEPRZEZROCZYSTE" })
  })

  it("mur za drzewem bezlistnym zasłania całkowicie — strata jak od samego muru, przypisana murowi", () => {
    const r = calculateAnalizaZacienienia({
      ...baza,
      punkt: { x: 0, y: 5, z: 0 },
      przeszkody: [{ ...lisciaste, srodek: { x: 0, y: 1 }, wysokoscM: 20 }, scianaPoludniowa],
      miesiaceBezlisci: ZIMA,
    }).value.obecnie
    const samMurDalej = calculateAnalizaZacienienia({ ...baza, punkt: { x: 0, y: 5, z: 0 }, przeszkody: [scianaPoludniowa] }).value.obecnie
    expect(samMurDalej.strataMiesiecznaProcent[0]!).toBeGreaterThan(0)
    for (const m of ZIMA) expect(r.strataMiesiecznaProcent[m]!).toBeCloseTo(samMurDalej.strataMiesiecznaProcent[m]!, 9)
    expect(r.udzialPrzeszkod.reduce((a, u) => a + u.procent, 0)).toBeCloseTo(r.strataRocznaProcent, 9)
  })

  it("miesiąc spoza 0–11 → INVALID_INPUT", () => {
    const r = calculateAnalizaZacienienia({ ...baza, przeszkody: [lisciaste], miesiaceBezlisci: [12] })
    expect(r.status).toBe("INVALID_INPUT")
    expect(r.warnings[0]!.field).toBe("miesiaceBezlisci")
  })
})
