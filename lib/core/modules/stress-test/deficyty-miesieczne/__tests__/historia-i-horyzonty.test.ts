import { describe, expect, it } from "vitest"
import { calculateDeficytyMiesieczne, CALCULATOR_VERSION } from "../calculator"
import type { DeficytyMiesieczneInput, HistoriaDobowa, RokHistorii } from "../input"
import { dobowyDeficyt, percentylNajblizszejRangi } from "../historia"

const dwanascie = (zmiany: Record<number, number>) => Array.from({ length: 12 }, (_, i) => zmiany[i + 1] ?? 0)

// 5 kW × 0.8 = 4 kW useful, 1.5 l/h → 0.375 l/kWh.
const BAZA: DeficytyMiesieczneInput = {
  deficytyKwh: dwanascie({ 12: 124 }), // December: 31 days → 4 kWh/day
  mocAgregatuKw: 5,
  zuzyciePaliwaLH: 1.5,
  cenaPaliwaZlL: 8,
  kosztSerwisuZlH: 0,
  zapasPaliwaL: 0,
}

/** Own fixture: a whole year of PV = 4 kWh/day, with an optional block of dark days (PV = 0) from `blok[0]` (day index). */
function rok(r: number, blok?: [number, number], dlugosc = 365): RokHistorii {
  return { rok: r, dni: Array.from({ length: dlugosc }, (_, i) => (blok && i >= blok[0] && i < blok[0] + blok[1] ? 0 : 4)) }
}
const HIST: HistoriaDobowa = {
  zrodlo: "wpisane-reczne",
  rodzaj: "produkcja-pv-kwh",
  lata: [rok(2021, [9, 10]), rok(2022, [9, 5]), rok(2023)],
}
const POPYT = Array.from({ length: 12 }, () => 10)

describe("łańcuch agregatu i stałe horyzonty (M7/E2, 1.1.0)", () => {
  it("wersja kalkulatora podniesiona do 1.4.0 (1.2.0 D74: miesiąc bez danych to brak wyniku; 1.3.0: magazyn w historii; 1.4.0: dzień/noc)", () => {
    expect(CALCULATOR_VERSION).toBe("1.4.0")
  })

  it("łańcuch: 5 kW × 0,8 = 4 kW na godzinę, 0,375 l/kWh, 124 kWh → 31 h → 46,5 l", () => {
    const l = calculateDeficytyMiesieczne(BAZA).value.lancuch!
    expect(l.mocUzytecznaKw).toBeCloseTo(4, 12)
    expect(l.litryNaKwh).toBeCloseTo(0.375, 12)
    expect(l.kosztPaliwaNaKwhZl).toBeCloseTo(3, 12)
    expect(l.energiaKwh).toBe(124)
    expect(l.godzinyPracy).toBeCloseTo(31, 12)
    expect(l.paliwoL).toBeCloseTo(46.5, 12)
  })

  it("horyzonty 3 / 7 / 14 dni / miesiąc z najgorszego miesiąca (4 kWh/dobę)", () => {
    const h = calculateDeficytyMiesieczne(BAZA).value.horyzonty
    expect(h.map((x) => x.klucz)).toEqual(["3", "7", "14", "miesiac"])
    expect(h.map((x) => x.dni)).toEqual([3, 7, 14, 31])
    expect(h.map((x) => x.paliwoL)).toEqual([4.5, 10.5, 21, 46.5])
    expect(h[1]!.godzinyPracy).toBeCloseTo(7, 12)
    expect(h.every((x) => x.zapasWystarcza === null && !x.wybrany)).toBe(true)
  })

  it("wybrany horyzont 14 dni: 🟡 gdy zapas 20 l < 21 l, bez ostrzeżenia przy 21 l", () => {
    const hor = { rodzaj: "dni", dni: 14 } as const
    const za = calculateDeficytyMiesieczne({ ...BAZA, horyzont: hor, zapasPaliwaL: 20 })
    expect(za.warnings.map((w) => [w.code, w.params?.dni, w.params?.litry])).toEqual([["DEFM-HORYZONT-PONAD-ZAPAS", 14, 21]])
    expect(za.status).toBe("VALID_WITH_WARNINGS")
    expect(za.value.horyzonty.find((x) => x.wybrany)!.zapasWystarcza).toBe(false)
    const ok = calculateDeficytyMiesieczne({ ...BAZA, horyzont: hor, zapasPaliwaL: 21 })
    expect(ok.warnings).toEqual([])
    expect(ok.status).toBe("VALID")
  })

  it("cały miesiąc i własna liczba dni (10 dni → 40 kWh → 10 h → 15 l)", () => {
    const m = calculateDeficytyMiesieczne({ ...BAZA, horyzont: { rodzaj: "miesiac" }, zapasPaliwaL: 46 })
    expect(m.warnings.map((w) => w.code)).toEqual(["DEFM-HORYZONT-PONAD-ZAPAS"])
    const w = calculateDeficytyMiesieczne({ ...BAZA, horyzont: { rodzaj: "dni", dni: 10 } })
    const wlasny = w.value.horyzonty.find((x) => x.klucz === "wlasny")!
    expect(wlasny.paliwoL).toBeCloseTo(15, 12)
    expect(wlasny.wybrany).toBe(true)
  })

  it("zgodność wsteczna: bez horyzontu stare ostrzeżenia miesiąc po miesiącu", () => {
    const w = calculateDeficytyMiesieczne({ ...BAZA, deficytyKwh: dwanascie({ 2: 160, 12: 124 }), zapasPaliwaL: 50 })
    expect(w.warnings.map((x) => [x.code, x.params?.miesiac])).toEqual([["DEFM-PALIWO-PONAD-ZAPAS", 2]])
    expect(w.value.historia).toBeNull()
    expect(w.value.deficytyZHistorii).toBe(false)
  })

  it("horyzont poza zakresem → INVALID_INPUT", () => {
    expect(calculateDeficytyMiesieczne({ ...BAZA, horyzont: { rodzaj: "dni", dni: 0 } }).status).toBe("INVALID_INPUT")
    expect(calculateDeficytyMiesieczne({ ...BAZA, horyzont: { rodzaj: "dni", dni: 400 } }).status).toBe("INVALID_INPUT")
  })
})

describe("historia wieloletnia (M7/E2, tryb realistyczny)", () => {
  const zHist = (a: Partial<DeficytyMiesieczneInput["analizaHistorii"] & object>, wiecej: Partial<DeficytyMiesieczneInput> = {}) =>
    calculateDeficytyMiesieczne({
      ...BAZA,
      deficytyKwh: dwanascie({}),
      historia: HIST,
      zapotrzebowanieDobaKwh: POPYT,
      analizaHistorii: { oknoDni: 7, percentylPct: 60, progSlabegoDniaPct: 30, ...a },
      ...wiecej,
    })

  it("najgorsze 7-dniowe okno każdego roku: 70 / 62 / 42 kWh → litry po 0,375 l/kWh", () => {
    const w = zHist({})
    const o = w.value.historia!.okno!
    expect(o.lata.map((x) => x.deficytKwh)).toEqual([70, 62, 42])
    expect(o.rozklad).toMatchObject({ n: 3, min: 42, mediana: 62, percentyl: 62, max: 70 })
    const z = w.value.zapasZHistorii!
    expect(z.litryMin).toBeCloseTo(15.75, 12)
    expect(z.litryPercentyl).toBeCloseTo(23.25, 12)
    expect(z.litryMax).toBeCloseTo(26.25, 12)
    expect(z.lataPokryte).toBeNull()
  })

  it("serie dni słabych (PV < 30% popytu): najdłuższa 10 dni, rozkład 0 / 5 / 10", () => {
    const s = zHist({}).value.historia!.serie!
    expect(s.najdluzszaDni).toBe(10)
    expect(s.najdluzszaWRoku.map((x) => x.dni)).toEqual([10, 5, 0])
    expect(s.rozklad).toMatchObject({ n: 3, min: 0, mediana: 5, percentyl: 5, max: 10 })
  })

  it("rozkład deficytów miesięcznych: styczeń 226 / 206 / 186; deficyty z historii (percentyl) gdy nie wpisane", () => {
    const w = zHist({})
    const sty = w.value.historia!.miesiace[0]!
    expect(sty.miesiac).toBe(1)
    expect(sty.deficytKwh).toMatchObject({ n: 3, min: 186, mediana: 206, percentyl: 206, max: 226 })
    expect(w.value.deficytyZHistorii).toBe(true)
    expect(w.value.miesiace[0]!.deficytKwh).toBe(206)
    expect(w.assumptions.map((a) => (typeof a === "string" ? a : a.kod))).toContain("DEFM-ZALOZENIE-DEFICYTY-Z-HISTORII")
    expect(w.value.historia!.liczbaLat).toBe(3)
    expect(w.value.historia!.liczbaDniZDanymi).toBe(3 * 365)
  })

  it("D74 pkt 5: miesiąc bez pełnych danych w żadnym roku → brak wyniku (nie 0) i 🟡", () => {
    // Every year cut after 31 January → only January has complete data.
    const krotka: HistoriaDobowa = { ...HIST, lata: [rok(2021, [9, 10], 31), rok(2022, [9, 5], 31)] }
    const w = zHist({}, { historia: krotka })
    expect(w.value.deficytyZHistorii).toBe(true)
    expect(w.value.miesiaceBezDanych).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    expect(w.value.miesiace.map((m) => m.miesiac)).toEqual([1])
    const ost = w.warnings.find((x) => x.code === "DEFM-HISTORIA-BRAK-MIESIECY")!
    expect(ost.level).toBe("warning")
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    // Shortfalls entered by hand → the history does not decide the months, nothing listed.
    const reczne = zHist({}, { historia: krotka, deficytyKwh: dwanascie({ 12: 124 }) })
    expect(reczne.value.miesiaceBezDanych).toEqual([])
    expect(reczne.warnings.map((x) => x.code)).not.toContain("DEFM-HISTORIA-BRAK-MIESIECY")
  })

  it("wpisane deficyty mają pierwszeństwo przed historią", () => {
    const w = zHist({}, { deficytyKwh: dwanascie({ 12: 124 }) })
    expect(w.value.deficytyZHistorii).toBe(false)
    expect(w.value.miesiace.map((m) => m.miesiac)).toEqual([12])
    expect(w.value.historia).not.toBeNull()
  })

  it("🟡 zapas 20 l poniżej percentyla 23,25 l; zapas wystarczyłby w 1 z 3 lat", () => {
    const w = zHist({}, { zapasPaliwaL: 20 })
    expect(w.warnings.map((x) => x.code)).toContain("DEFM-HISTORIA-ZAPAS-ZA-MALY")
    expect(w.value.zapasZHistorii!.lataPokryte).toBe(1)
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    const ok = zHist({}, { zapasPaliwaL: 24 })
    expect(ok.warnings.map((x) => x.code)).not.toContain("DEFM-HISTORIA-ZAPAS-ZA-MALY")
    expect(ok.value.zapasZHistorii!.lataPokryte).toBe(2)
  })

  it("mało danych: percentyl równy maksimum (P90 z 3 lat) i jeden rok — uczciwa notatka", () => {
    expect(zHist({ percentylPct: 90 }).warnings.map((x) => x.code)).toContain("DEFM-HISTORIA-PERCENTYL-TO-MAKSIMUM")
    expect(zHist({ percentylPct: 60 }).warnings.map((x) => x.code)).not.toContain("DEFM-HISTORIA-PERCENTYL-TO-MAKSIMUM")
    const jeden = zHist({}, { historia: { ...HIST, lata: [rok(2023)] } })
    expect(jeden.warnings.map((x) => x.code)).toContain("DEFM-HISTORIA-MALO-DANYCH")
    expect(jeden.value.historia!.malo).toBe("jeden-rok")
  })

  it("brak dnia (null) przerywa okno i serię, brak pełnego okna → rok pominięty", () => {
    const dziurawy: RokHistorii = { rok: 2020, dni: [4, 4, 4, null, 4, 4, 4] }
    const krotki: RokHistorii = { rok: 2019, dni: [0, 0, 0] }
    const w = zHist({}, { historia: { ...HIST, lata: [rok(2021), dziurawy, krotki] } })
    expect(w.value.historia!.lataPominiete).toEqual([2020, 2019])
    expect(w.value.historia!.liczbaLat).toBe(1)
    expect(w.warnings.map((x) => x.code)).toContain("DEFM-HISTORIA-POMINIETE-LATA")
  })

  it("nasłonecznienie H [kWh/m²] × kWp × PR → produkcja (2 × 3 × 0,8 = 4,8 kWh/dobę)", () => {
    const naswietlenie: HistoriaDobowa = {
      zrodlo: "pvgis-seriescalc",
      rodzaj: "naswietlenie-kwh-m2",
      lata: [{ rok: 2023, dni: Array.from({ length: 365 }, () => 2) }],
      przeliczenie: { mocPvKwp: 3, wspolczynnikPr: 0.8 },
    }
    const w = zHist({ progSlabegoDniaPct: 0 }, { historia: naswietlenie })
    expect(w.value.historia!.okno!.lata[0]!.deficytKwh).toBeCloseTo(7 * (10 - 4.8), 9)
    expect(w.value.historia!.serie).toBeNull()
  })

  it("rok przestępny: 366 wartości przechodzi, 367 i 366 w roku zwykłym — INVALID_INPUT", () => {
    const hist = (r: RokHistorii): HistoriaDobowa => ({ ...HIST, lata: [r] })
    expect(zHist({}, { historia: hist(rok(2024, undefined, 366)) }).status).not.toBe("INVALID_INPUT")
    expect(zHist({}, { historia: hist(rok(2024, undefined, 367)) }).status).toBe("INVALID_INPUT")
    expect(zHist({}, { historia: hist(rok(2023, undefined, 366)) }).status).toBe("INVALID_INPUT")
  })

  it("błędne dane: ujemna produkcja, powtórzony rok, brak przeliczenia, percentyl > 100", () => {
    expect(zHist({}, { historia: { ...HIST, lata: [{ rok: 2023, dni: [-1] }] } }).status).toBe("INVALID_INPUT")
    expect(zHist({}, { historia: { ...HIST, lata: [rok(2023), rok(2023)] } }).status).toBe("INVALID_INPUT")
    expect(zHist({}, { historia: { ...HIST, rodzaj: "naswietlenie-kwh-m2" } }).status).toBe("INVALID_INPUT")
    expect(zHist({ percentylPct: 101 }).status).toBe("INVALID_INPUT")
  })

  it("historia bez zapotrzebowania albo okna: tylko info, wynik jak bez historii", () => {
    const w = calculateDeficytyMiesieczne({ ...BAZA, historia: HIST })
    expect(w.value.historia).toBeNull()
    expect(w.warnings.map((x) => x.code)).toContain("DEFM-HISTORIA-BRAK-PARAMETROW")
    expect(w.value.miesiace.map((m) => m.miesiac)).toEqual([12])
  })

  it("percentyl metodą najbliższej rangi (bez interpolacji)", () => {
    expect(percentylNajblizszejRangi([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 90)).toBe(9)
    expect(percentylNajblizszejRangi([10, 20], 1)).toBe(10)
    expect(percentylNajblizszejRangi([10, 20], 100)).toBe(20)
  })
})

describe("magazyn energii w bilansie dobowym historii (M7/E2 (a), 1.3.0)", () => {
  const popyt10 = () => 10
  // PV 14, 14, 0, 0, (missing), 0 at demand 10 → balances +4, +4, −10, −10, ?, −10.
  const PV = [14, 14, 0, 0, null, 0]

  it("bez magazynu albo przy pojemności 0: deficyt = max(0, popyt − PV), jak w 1.2.0", () => {
    expect(dobowyDeficyt(PV, popyt10)).toEqual([0, 0, 10, 10, null, 10])
    expect(dobowyDeficyt(PV, popyt10, { pojemnoscUzytecznaKwh: 0, sprawnoscPct: 90, stanPoczatkowyPct: 50 })).toEqual([0, 0, 10, 10, null, 10])
  })

  it("6 kWh, 80%, start 50%: 3 → min(6; 3 + 3,2) = 6 → 6, doba 3 bierze 6 z magazynu (deficyt 4), potem pusty; brak dnia zeruje stan", () => {
    const m = { pojemnoscUzytecznaKwh: 6, sprawnoscPct: 80, stanPoczatkowyPct: 50 }
    const d = dobowyDeficyt(PV, popyt10, m)
    expect(d[0]).toBe(0)
    expect(d[1]).toBe(0)
    expect(d[2]).toBeCloseTo(4, 12)
    expect(d.slice(3)).toEqual([10, null, 10])
  })

  it("brak dnia przy pełnym magazynie: stan po przerwie = 0 (strona bezpieczna)", () => {
    const m = { pojemnoscUzytecznaKwh: 20, sprawnoscPct: 100, stanPoczatkowyPct: 100 }
    expect(dobowyDeficyt([null, 0], popyt10, m)).toEqual([null, 10])
    expect(dobowyDeficyt([10, 0], popyt10, m)).toEqual([0, 0])
  })

  // One year: PV 14 kWh every day except 3 dark days (index 40–42), demand 10 kWh/day, window 3 days.
  const ROK: HistoriaDobowa = {
    zrodlo: "wpisane-reczne",
    rodzaj: "produkcja-pv-kwh",
    lata: [{ rok: 2023, dni: Array.from({ length: 365 }, (_, i) => (i >= 40 && i < 43 ? 0 : 14)) }],
  }
  const wejscie = (magazyn?: { pojemnoscUzytecznaKwh: number; sprawnoscPct: number; stanPoczatkowyPct: number }): DeficytyMiesieczneInput => ({
    ...BAZA,
    deficytyKwh: dwanascie({}),
    zapotrzebowanieDobaKwh: POPYT,
    historia: ROK,
    analizaHistorii: { oknoDni: 3, percentylPct: 0, progSlabegoDniaPct: 0, ...(magazyn ? { magazyn } : {}) },
  })

  it("okno 3 ciemnych dób: bez magazynu 30 kWh → 11,25 l; z magazynem 8 kWh (100%) 22 kWh → 8,25 l", () => {
    const bez = calculateDeficytyMiesieczne(wejscie())
    expect(bez.value.zapasZHistorii!.litryMax).toBeCloseTo(11.25, 12)
    const kod = (a: (typeof bez.assumptions)[number]) => (typeof a === "string" ? a : a.kod)
    expect(bez.assumptions.map(kod)).toContain("DEFM-ZALOZENIE-HISTORIA")
    const z = calculateDeficytyMiesieczne(wejscie({ pojemnoscUzytecznaKwh: 8, sprawnoscPct: 100, stanPoczatkowyPct: 0 }))
    expect(z.value.zapasZHistorii!.litryMax).toBeCloseTo(8.25, 12)
    expect(z.value.historia!.zMagazynem).toBe(true)
    const zal = z.assumptions.find((a) => kod(a) === "DEFM-ZALOZENIE-HISTORIA-MAGAZYN")
    expect(typeof zal === "object" ? zal.params : null).toEqual({
      zrodlo: "wpisane-reczne",
      pojemnosc: 8,
      sprawnosc: 100,
      stan: 0,
    })
  })

  it("pojemność bez sprawności → INCOMPLETE (nic nie przyjmujemy); pojemność 0 → wynik jak bez magazynu", () => {
    expect(calculateDeficytyMiesieczne(wejscie({ pojemnoscUzytecznaKwh: 8, sprawnoscPct: 0, stanPoczatkowyPct: 0 })).status).toBe("INCOMPLETE")
    const zero = calculateDeficytyMiesieczne(wejscie({ pojemnoscUzytecznaKwh: 0, sprawnoscPct: 0, stanPoczatkowyPct: 0 }))
    expect(zero.value.zapasZHistorii!.litryMax).toBeCloseTo(11.25, 12)
    expect(zero.value.historia!.zMagazynem).toBe(false)
  })

  it("wartości poza zakresem → INVALID_INPUT", () => {
    for (const m of [
      { pojemnoscUzytecznaKwh: -1, sprawnoscPct: 90, stanPoczatkowyPct: 0 },
      { pojemnoscUzytecznaKwh: 8, sprawnoscPct: 101, stanPoczatkowyPct: 0 },
      { pojemnoscUzytecznaKwh: 8, sprawnoscPct: 90, stanPoczatkowyPct: 120 },
    ]) {
      expect(calculateDeficytyMiesieczne(wejscie(m)).status).toBe("INVALID_INPUT")
    }
  })
})

describe("podział doby na dzień i noc w bilansie historii (M7/E2, 1.4.0)", () => {
  const popyt10 = () => 10
  // Night share 40% at demand 10 → day part 6, night part 4.

  it("bez magazynu: deficyt = max(0, część dzienna − PV) + część nocna", () => {
    expect(dobowyDeficyt([14, 3, null], popyt10, undefined, 40)).toEqual([4, 7, null])
  })

  it("z magazynem 5 kWh, 100%, start 0: noc bierze z magazynu tylko to, co dzień do niego włożył", () => {
    const m = { pojemnoscUzytecznaKwh: 5, sprawnoscPct: 100, stanPoczatkowyPct: 0 }
    // day 0: +8 → store 5, night 4 → store 1, shortfall 0; day 1: −3 → 1 from store, 2 short, night 4 → 6; day 2: 6 + 4.
    expect(dobowyDeficyt([14, 3, 0], popyt10, m, 40)).toEqual([0, 6, 10])
  })

  it("udział 0 = wynik jak w 1.3.0 (dzień i noc razem)", () => {
    const m = { pojemnoscUzytecznaKwh: 6, sprawnoscPct: 80, stanPoczatkowyPct: 50 }
    const PV = [14, 14, 0, 0, null, 0]
    expect(dobowyDeficyt(PV, popyt10, m, 0)).toEqual(dobowyDeficyt(PV, popyt10, m))
    expect(dobowyDeficyt(PV, popyt10, undefined, 0)).toEqual(dobowyDeficyt(PV, popyt10))
  })

  const ROK: HistoriaDobowa = {
    zrodlo: "wpisane-reczne",
    rodzaj: "produkcja-pv-kwh",
    lata: [{ rok: 2023, dni: Array.from({ length: 365 }, (_, i) => (i >= 40 && i < 43 ? 0 : 14)) }],
  }
  const wejscie = (udzialNocyPct?: number): DeficytyMiesieczneInput => ({
    ...BAZA,
    deficytyKwh: dwanascie({}),
    zapotrzebowanieDobaKwh: POPYT,
    historia: ROK,
    analizaHistorii: {
      oknoDni: 3,
      percentylPct: 0,
      progSlabegoDniaPct: 0,
      magazyn: { pojemnoscUzytecznaKwh: 8, sprawnoscPct: 100, stanPoczatkowyPct: 0 },
      ...(udzialNocyPct !== undefined ? { udzialNocyPct } : {}),
    },
  })
  const kod = (a: string | { kod: string }) => (typeof a === "string" ? a : a.kod)

  it("magazyn 8 kWh, noc 40%: przed ciemnymi dobami w magazynie zostaje 4 kWh → okno 26 kWh → 9,75 l (bez podziału 22 kWh → 8,25 l)", () => {
    const netto = calculateDeficytyMiesieczne(wejscie())
    expect(netto.value.zapasZHistorii!.litryMax).toBeCloseTo(8.25, 12)
    expect(netto.assumptions.map(kod)).toContain("DEFM-ZALOZENIE-HISTORIA-DOBA-NETTO")
    const dzienNoc = calculateDeficytyMiesieczne(wejscie(40))
    expect(dzienNoc.value.zapasZHistorii!.litryMax).toBeCloseTo(9.75, 12)
    const zal = dzienNoc.assumptions.find((a) => kod(a) === "DEFM-ZALOZENIE-HISTORIA-DZIEN-NOC")
    expect(typeof zal === "object" ? zal.params : null).toEqual({ noc: 40 })
    expect(dzienNoc.assumptions.map(kod)).not.toContain("DEFM-ZALOZENIE-HISTORIA-DOBA-NETTO")
  })

  it("udział poza 0..100 → INVALID_INPUT", () => {
    expect(calculateDeficytyMiesieczne(wejscie(120)).status).toBe("INVALID_INPUT")
    expect(calculateDeficytyMiesieczne(wejscie(-1)).status).toBe("INVALID_INPUT")
  })
})
