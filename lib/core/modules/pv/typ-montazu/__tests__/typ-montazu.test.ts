import { describe, expect, it } from "vitest"
import type { TabelaNapromieniowania } from "../../kat-i-azymut/input"
import { PRZYSPIESZENIE_ZIEMSKIE_M_S2 } from "../../zloty-srodek/constants"
import { calculateDachPlaski } from "../dach-plaski"
import type { DachPlaskiInput, PowierzchnieInput, RegulowanyInput, WiataInput } from "../input"
import { calculatePionowy } from "../pionowy"
import { calculatePowierzchnie } from "../powierzchnie"
import { calculateRegulowany } from "../regulowany"
import { calculateWiata, ulozPanele } from "../wiata"

/**
 * Syntetyczna tabela sezonowa (NIE dane klimatyczne): w miesiącu m napromieniowanie ma szczyt A[m] przy
 * kącie O[m] i spada paraboliczne — zimą najlepsze są kąty strome, latem płaskie (jak w rzeczywistości).
 * Najlepszy kąt stały = 44°, pion wygrywa w styczniu, listopadzie i grudniu (policzone niezależnie).
 */
const A = [60, 80, 110, 140, 170, 180, 175, 155, 120, 90, 60, 50]
const O = [70, 60, 45, 35, 20, 15, 18, 28, 42, 55, 68, 72]
const H = (k: number, m: number) => A[m]! - 0.01 * (k - O[m]!) ** 2
const tabela: TabelaNapromieniowania = {
  azymutDeg: 180,
  albedo: 0.2,
  katyDeg: Array.from({ length: 91 }, (_, k) => k),
  miesiace: Array.from({ length: 91 }, (_, k) => Array.from({ length: 12 }, (_, m) => H(k, m))),
}
const sumaRoczna = (k: number) => A.reduce((s, _, m) => s + H(k, m), 0)

/** Strefa 1, A = 100 m, teren III, ze < zmin = 5 m → ce = 1,9·(5/10)^0,26 (Tablica NA.3), qb = 300 Pa. */
const qp = 300 * 1.9 * 0.5 ** 0.26
const wiatr = { strefaWiatrowa: 1 as const, wysokoscNpmM: 100, kategoriaTerenu: "III" as const, wspolczynnikPhi: 0 }
const kody = (r: { warnings: { code: string }[] }) => r.warnings.map((w) => w.code)

describe("calculatePionowy (M3/E2, dawne 2.4)", () => {
  const bazowe = { tabela, wysokoscDolnejKrawedziM: null, wysokoscTrawySnieguCm: null }

  it("pion vs najlepszy kąt stały: miesiące zysku wynikają z danych, bilans roczny", () => {
    const r = calculatePionowy(bazowe)
    expect(r.status).toBe("VALID")
    const v = r.value!
    expect(v.optimumDeg).toBe(44)
    expect(v.miesiaceZysku).toEqual([0, 10, 11])
    expect(v.pionowyRocznieKwhM2).toBeCloseTo(sumaRoczna(90), 9)
    expect(v.roznicaRocznaPct).toBeCloseTo((100 * (sumaRoczna(90) - sumaRoczna(44))) / sumaRoczna(44), 9)
    expect(v.miesiace[11]!.roznicaPct).toBeCloseTo((100 * (H(90, 11) - H(44, 11))) / H(44, 11), 9)
    expect(v.zyskKwhM2 - v.strataKwhM2).toBeCloseTo(sumaRoczna(90) - sumaRoczna(44), 9)
    expect(v.zaspaZacienia).toBeNull()
  })

  it("trawa/zaspa wyżej niż dolna krawędź → ostrzeżenie; niżej → brak; granica równa → brak", () => {
    const zacienia = calculatePionowy({ tabela, wysokoscDolnejKrawedziM: 0.3, wysokoscTrawySnieguCm: 40 })
    expect(zacienia.status).toBe("VALID_WITH_WARNINGS")
    expect(kody(zacienia)).toEqual(["TM-ZASPA-ZACIENIA-DOLNE-OGNIWA"])
    expect(zacienia.value!.zaspaZacienia).toBe(true)
    const wolne = calculatePionowy({ tabela, wysokoscDolnejKrawedziM: 0.5, wysokoscTrawySnieguCm: 40 })
    expect(wolne.status).toBe("VALID")
    expect(wolne.value!.zaspaZacienia).toBe(false)
    expect(calculatePionowy({ tabela, wysokoscDolnejKrawedziM: 0.4, wysokoscTrawySnieguCm: 40 }).value!.zaspaZacienia).toBe(false)
  })

  it("brak tabeli → INCOMPLETE; ujemna wysokość → INVALID_INPUT", () => {
    expect(calculatePionowy({ ...bazowe, tabela: null }).status).toBe("INCOMPLETE")
    expect(calculatePionowy({ ...bazowe, wysokoscTrawySnieguCm: -1 }).status).toBe("INVALID_INPUT")
  })
})

describe("calculateDachPlaski (M3/E2, dawne 2.5)", () => {
  const bazowe: DachPlaskiInput = {
    ...wiatr,
    miejsce: "grunt",
    nachylenieDeg: 30,
    dlugoscWzdluzSpaduM: 2,
    szerokoscStelazaM: 5,
    wysokoscDolnejKrawedziM: 0.5,
    masaPaneliStelazaKg: null,
  }

  it("h = L × sin(α) 1:1 ze źródła (L = 2,1 m, 35° → 1,2 m jak w przykładzie)", () => {
    expect(calculateDachPlaski({ ...bazowe, dlugoscWzdluzSpaduM: 2.1, nachylenieDeg: 35 }).value!.podniesienieM).toBeCloseTo(
      2.1 * Math.sin((35 * Math.PI) / 180),
      12,
    )
    expect(calculateDachPlaski(bazowe).value!.podniesienieM).toBeCloseTo(1, 12)
  })

  it("30°, φ = 0: Fw = 1,8·qp·L·B, balast EQU = 1,5·Fw/(0,9·g); ze = krawędź dolna + h", () => {
    const r = calculateDachPlaski(bazowe)
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    const v = r.value!
    expect(v.zeM).toBeCloseTo(1.5, 12)
    expect(v.qpPa).toBeCloseTo(qp, 6)
    expect(v.silaWiatruN).toBeCloseTo(1.8 * qp * 10, 6)
    expect(v.balastKg).toBeCloseTo((1.5 * 1.8 * qp * 10) / (0.9 * PRZYSPIESZENIE_ZIEMSKIE_M_S2), 6)
    expect(kody(r)).toEqual(["ZS-BALAST-EQU-TYLKO-ODRYWANIE"])
    expect(v.mu1).toBe(0.8)
  })

  it("D29: masa paneli i stelaża odejmowana od balastu (γG,inf jak dla balastu), clamp do 0; ujemna → INVALID_INPUT", () => {
    const bez = calculateDachPlaski(bazowe)
    expect(bez.assumptions).toContainEqual({ kod: "ZS-ZALOZENIE-MASA-WLASNA-POMINIETA" })
    const r = calculateDachPlaski({ ...bazowe, masaPaneliStelazaKg: 50 })
    expect(r.value!.balastKg).toBeCloseTo(bez.value!.balastKg! - 50, 9)
    expect(r.assumptions).toContainEqual({ kod: "ZS-ZALOZENIE-MASA-WLASNA", params: { masa: 50, gammaG: 0.9 } })
    expect(calculateDachPlaski({ ...bazowe, masaPaneliStelazaKg: 1e6 }).value!.balastKg).toBe(0)
    expect(calculateDachPlaski({ ...bazowe, masaPaneliStelazaKg: -1 }).status).toBe("INVALID_INPUT")
  })

  it("35° — poza normą: siła i balast jako SZACUNEK (cf z 30°), kąt na własną odpowiedzialność użytkownika", () => {
    const r = calculateDachPlaski({ ...bazowe, nachylenieDeg: 35 })
    const v = r.value!
    expect(v.szacunek).toBe(true)
    expect(v.cf).toBe(1.8) // cf odrywania z 30° Tablicy 7.6 dla φ = 0
    expect(v.silaWiatruN).toBeCloseTo(1.8 * qp * 10, 6)
    expect(v.balastKg).toBeCloseTo((1.5 * 1.8 * qp * 10) / (0.9 * PRZYSPIESZENIE_ZIEMSKIE_M_S2), 6)
    expect(kody(r)).toEqual(["ZS-BALAST-EQU-TYLKO-ODRYWANIE", "WP30-KAT-NA-WLASNA-ODPOWIEDZIALNOSC"])
    expect(r.assumptions.some((a) => typeof a !== "string" && a.kod === "WP30-ZALOZENIE-CF-Z-30")).toBe(true)
  })

  it("szacunek obejmuje 31–89° tym samym współczynnikiem; do 30° to norma (szacunek = false), 90° to siła pozioma bez balastu", () => {
    for (const kat of [31, 60, 89]) {
      const v = calculateDachPlaski({ ...bazowe, nachylenieDeg: kat }).value!
      expect(v.szacunek).toBe(true)
      expect(v.cf).toBe(1.8)
      expect(v.balastKg).not.toBeNull()
    }
    expect(calculateDachPlaski({ ...bazowe, nachylenieDeg: 30 }).value!.szacunek).toBe(false)
    const pion = calculateDachPlaski({ ...bazowe, nachylenieDeg: 90 }).value!
    expect(pion.szacunek).toBe(false)
    expect(pion.balastKg).toBeNull()
  })

  it("próg ssania od spodu 45° (źródło ~45°) — critical; 44° bez niego", () => {
    const r45 = calculateDachPlaski({ ...bazowe, nachylenieDeg: 45 })
    expect(r45.warnings.find((w) => w.code === "TM-SSANIE-OD-SPODU")?.level).toBe("critical")
    expect(kody(calculateDachPlaski({ ...bazowe, nachylenieDeg: 44 }))).not.toContain("TM-SSANIE-OD-SPODU")
    const r90 = calculateDachPlaski({ ...bazowe, nachylenieDeg: 90 })
    expect(kody(r90)).toEqual(["ZS-PION-SILA-POZIOMA", "TM-SSANIE-OD-SPODU"])
    expect(r90.value!.cf).toBe(1.8)
  })

  it("< 30° — info o zaleganiu śniegu (nie podnosi statusu sam); dach — ostrzeżenie o modelu wiaty", () => {
    const r = calculateDachPlaski({ ...bazowe, nachylenieDeg: 20 })
    expect(kody(r)).toContain("TM-SNIEG-ZALEGA")
    expect(r.warnings.find((w) => w.code === "TM-SNIEG-ZALEGA")!.level).toBe("info")
    expect(kody(calculateDachPlaski({ ...bazowe, miejsce: "dach" }))).toContain("TM-DACH-POZA-MODELEM-WIATY")
    expect(kody(calculateDachPlaski(bazowe))).not.toContain("TM-DACH-POZA-MODELEM-WIATY")
  })

  it("brak pola → INCOMPLETE; wartość spoza dziedziny → INVALID_INPUT", () => {
    for (const pole of ["miejsce", "nachylenieDeg", "dlugoscWzdluzSpaduM", "szerokoscStelazaM", "wysokoscDolnejKrawedziM", "wspolczynnikPhi"] as const) {
      expect(calculateDachPlaski({ ...bazowe, [pole]: null }).status, pole).toBe("INCOMPLETE")
    }
    expect(calculateDachPlaski({ ...bazowe, wspolczynnikPhi: 1.5 }).status).toBe("INVALID_INPUT")
    expect(calculateDachPlaski({ ...bazowe, dlugoscWzdluzSpaduM: 0 }).status).toBe("INVALID_INPUT")
    expect(calculateDachPlaski({ ...bazowe, nachylenieDeg: 95 }).status).toBe("INVALID_INPUT")
  })
})

describe("calculatePowierzchnie (M3/E2, dawne 2.6/2.7)", () => {
  const oceny = [
    { nazwa: "Dach południowy", nachylenieDeg: 38, azymutDeg: 180, napromieniowanieRoczneKwhM2: 1000, wskaznikProcent: 92 },
    { nazwa: "Ogrodzenie wschodnie", nachylenieDeg: 90, azymutDeg: 90, napromieniowanieRoczneKwhM2: 500, wskaznikProcent: 42 },
  ]
  const bazowe: PowierzchnieInput = {
    oceny,
    wybrane: [
      { nazwa: "Dach południowy", mocKwp: 5 },
      { nazwa: "Ogrodzenie wschodnie", mocKwp: 2 },
    ],
    wspolczynnikPr: 0.8,
  }

  it("uzysk = moc × H × PR per powierzchnia i suma na żywo", () => {
    const r = calculatePowierzchnie(bazowe)
    expect(r.status).toBe("VALID")
    expect(r.value!.pozycje.map((p) => p.uzyskRocznyKwh)).toEqual([4000, 800])
    expect(r.value!.sumaUzyskuKwh).toBe(4800)
    expect(r.value!.sumaMocyKwp).toBe(7)
  })

  it("brak oceny M1, pusty wybór, brak PR albo mocy → INCOMPLETE", () => {
    expect(calculatePowierzchnie({ ...bazowe, oceny: null }).status).toBe("INCOMPLETE")
    expect(calculatePowierzchnie({ ...bazowe, wybrane: [] }).status).toBe("INCOMPLETE")
    expect(calculatePowierzchnie({ ...bazowe, wspolczynnikPr: null }).status).toBe("INCOMPLETE")
    expect(calculatePowierzchnie({ ...bazowe, wybrane: [{ nazwa: "Dach południowy", mocKwp: null }] }).status).toBe("INCOMPLETE")
  })

  it("nieznana powierzchnia albo PR > 1 → INVALID_INPUT", () => {
    const r = calculatePowierzchnie({ ...bazowe, wybrane: [{ nazwa: "Garaż", mocKwp: 1 }] })
    expect(r.status).toBe("INVALID_INPUT")
    expect(kody(r)).toEqual(["TM-POWIERZCHNIA-NIEZNANA"])
    expect(calculatePowierzchnie({ ...bazowe, wspolczynnikPr: 1.2 }).status).toBe("INVALID_INPUT")
  })
})

describe("calculateWiata (M3/E2, dawne 2.9)", () => {
  const bazowe: WiataInput = { dlugoscM: 6, szerokoscM: 4, dlugoscPaneluM: 2, szerokoscPaneluM: 1.5, mocPaneluW: 400, nachylenieDeg: 12 }

  it("przykład źródła 6×4 m → 8 paneli (4×2), 3,2 kWp (wymiary panelu 2,0×1,5 m — założenie testu)", () => {
    const r = calculateWiata(bazowe)
    expect(r.status).toBe("VALID")
    expect(r.value!.liczbaPaneli).toBe(8)
    expect(r.value!.bloki).toEqual([{ orientacja: "wzdluzSzerokosci", kolumny: 4, rzedy: 2 }])
    expect(r.value!.mocKwp).toBeCloseTo(3.2, 12)
    expect(r.value!.pokryciePct).toBeCloseTo(100, 9)
  })

  it("układ mieszany bije oba jednorodne: 3×3 m, panel 2×1 → 4 (zamiast 3)", () => {
    const u = ulozPanele(3, 3, 2, 1)
    expect(u.liczbaPaneli).toBe(4)
    expect(u.bloki).toHaveLength(2)
    expect(u.podzial).toBe("obokWzdluzDlugosci")
  })

  it("podział zmiennoprzecinkowy: 0,9/0,3 i 0,3/0,1 liczone jako 3", () => {
    expect(ulozPanele(0.9, 0.3, 0.3, 0.1).liczbaPaneli).toBe(9)
  })

  it("kąt < 5° — ostrzeżenie; 5–10° — info (zakres źródła); ≥ 10° — nic", () => {
    const r3 = calculateWiata({ ...bazowe, nachylenieDeg: 3 })
    expect(r3.status).toBe("VALID_WITH_WARNINGS")
    expect(kody(r3)).toEqual(["TM-WIATA-KAT-PONIZEJ-SAMOOCZYSZCZANIA"])
    const r7 = calculateWiata({ ...bazowe, nachylenieDeg: 7 })
    expect(r7.status).toBe("VALID")
    expect(kody(r7)).toEqual(["TM-WIATA-KAT-W-ZAKRESIE"])
    expect(kody(calculateWiata({ ...bazowe, nachylenieDeg: 10 }))).toEqual([])
  })

  it("panel większy od połaci → 0 paneli z ostrzeżeniem; brak pola → INCOMPLETE; zero → INVALID_INPUT", () => {
    const r = calculateWiata({ ...bazowe, dlugoscM: 1, szerokoscM: 1 })
    expect(r.value!.liczbaPaneli).toBe(0)
    expect(kody(r)).toEqual(["TM-WIATA-ZERO-PANELI"])
    expect(calculateWiata({ ...bazowe, mocPaneluW: null }).status).toBe("INCOMPLETE")
    expect(calculateWiata({ ...bazowe, szerokoscPaneluM: 0 }).status).toBe("INVALID_INPUT")
  })
})

describe("calculateRegulowany (M3/E2, D26)", () => {
  const bazowe: RegulowanyInput = {
    ...wiatr,
    tabela,
    katMinDeg: 0,
    katMaxDeg: 30,
    dlugoscWzdluzSpaduM: 2,
    szerokoscStelazaM: 5,
    wysokoscDolnejKrawedziM: 0.5,
    masaPaneliStelazaKg: null,
  }

  it("kąt miesiąca = najlepszy w zakresie regulacji; zysk vs najlepszy kąt stały w tym zakresie", () => {
    const v = calculateRegulowany({ ...bazowe, katMinDeg: 20, katMaxDeg: 50 }).value!
    expect(v.miesiace[0]!.katDeg).toBe(50) // styczeń: szczyt 70° przycięty do 50°
    expect(v.miesiace[5]!.katDeg).toBe(20) // czerwiec: szczyt 15° przycięty do 20°
    expect(v.miesiace[3]!.katDeg).toBe(35)
    expect(v.miesiace[0]!.podniesienieM).toBeCloseTo(2 * Math.sin((50 * Math.PI) / 180), 12)
    expect(v.katStalyDeg).toBe(44)
    expect(v.zyskRegulacjiPct).toBeGreaterThan(0)
  })

  it("ustawienia > 30°: szacunek wiatru i balastu liczony, ostrzeżenie o własnej odpowiedzialności z liczbą miesięcy", () => {
    const r = calculateRegulowany({ ...bazowe, katMinDeg: 20, katMaxDeg: 50 })
    const v = r.value!
    const powyzej = v.miesiace.filter((m) => m.katDeg > 30)
    expect(powyzej.length).toBeGreaterThan(0)
    expect(v.liczbaMiesiecySzacunekWiatru).toBe(powyzej.length)
    const ostrzezenie = r.warnings.find((w) => w.code === "WP30-MIESIACE-NA-WLASNA-ODPOWIEDZIALNOSC")!
    expect(ostrzezenie.params).toEqual({ liczba: powyzej.length, katMaks: Math.max(...powyzej.map((m) => m.katDeg)), max: 30 })
    expect(powyzej.every((m) => m.szacunek && m.balastKg !== null && m.silaWiatruN !== null)).toBe(true)
    expect(v.miesiace.filter((m) => m.katDeg <= 30).every((m) => !m.szacunek)).toBe(true)
    // wymagany balast uwzględnia także miesiące z szacunkiem (najgorszy miesiąc wyznacza stelaż)
    expect(v.balastWymaganyKg).toBe(Math.max(...v.miesiace.map((m) => m.balastKg!)))
    expect(kody(r)).toContain("TM-SSANIE-OD-SPODU")
  })

  it("zakres 0–30°: balast wymagany = największy z miesięcy, bez ostrzeżenia o brakach", () => {
    const r = calculateRegulowany(bazowe)
    const v = r.value!
    expect(v.liczbaMiesiecySzacunekWiatru).toBe(0)
    expect(v.balastWymaganyKg).toBe(Math.max(...v.miesiace.map((m) => m.balastKg!)))
    expect(kody(r)).toEqual(["ZS-BALAST-EQU-TYLKO-ODRYWANIE"])
  })

  it("D29: balast wymagany = największy z miesięcy minus masa paneli i stelaża", () => {
    const bez = calculateRegulowany(bazowe).value!
    const r = calculateRegulowany({ ...bazowe, masaPaneliStelazaKg: 50 })
    expect(r.value!.balastWymaganyKg).toBeCloseTo(bez.balastWymaganyKg! - 50, 9)
    expect(r.assumptions).toContainEqual({ kod: "ZS-ZALOZENIE-MASA-WLASNA", params: { masa: 50, gammaG: 0.9 } })
  })

  it("zakres odwrócony → INVALID_INPUT; zakres bez węzła siatki albo brak tabeli → INCOMPLETE", () => {
    expect(kody(calculateRegulowany({ ...bazowe, katMinDeg: 40, katMaxDeg: 20 }))).toEqual(["TM-ZAKRES-REGULACJI-ODWROCONY"])
    expect(calculateRegulowany({ ...bazowe, katMinDeg: 30.2, katMaxDeg: 30.6 }).status).toBe("INCOMPLETE")
    expect(calculateRegulowany({ ...bazowe, tabela: null }).status).toBe("INCOMPLETE")
    expect(calculateRegulowany({ ...bazowe, katMaxDeg: null }).status).toBe("INCOMPLETE")
  })
})
