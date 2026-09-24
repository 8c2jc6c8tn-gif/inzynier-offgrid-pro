import { describe, expect, it } from "vitest"
import { calculateSkanerDzialki } from "@/lib/core/modules/lokalizacja/skaner-dzialki/calculator"
import type { PunktGps } from "@/lib/core/modules/lokalizacja/skaner-dzialki/input"
import {
  dachWedlugObrysu,
  elewacje,
  horyzontyPolaci,
  kierunek,
  liczba,
  MODEL_PUSTY,
  polacieLokalne,
  powierzchnieDoOceny,
  powierzchnieZModelu,
  przeszkodyZacienienia,
  punktyProbkowania,
  wejscieSkanera,
  wejscieZacienienia,
  type ModelDzialki,
} from "../model-dzialki"

// ~1 m w stopniach na 52° N (wystarczająco dokładnie do budowy prostokątów testowych).
const LAT0 = 52.0
const LON0 = 21.0
const M_LAT = 1 / 111_257
const M_LON = 1 / 68_677
const p = (x: number, y: number, wysokoscM?: number): PunktGps => ({
  szerokosc: LAT0 + y * M_LAT,
  dlugosc: LON0 + x * M_LON,
  ...(wysokoscM !== undefined ? { wysokoscM } : {}),
})

/** Budynek 10 × 8 m (x — wschód, y — północ), grunt 100 m, dach dwuspadowy S/N, kalenica 105 m wzdłuż osi x. */
const MODEL: ModelDzialki = {
  ...MODEL_PUSTY,
  budynek: [p(0, 0, 100), p(10, 0, 100), p(10, 8, 100), p(0, 8, 100)],
  polacie: [
    { nazwa: "Połać S", punkty: [p(0, 0, 103), p(10, 0, 103), p(10, 4, 105), p(0, 4, 105)] },
    { nazwa: "Połać N", punkty: [p(0, 4, 105), p(10, 4, 105), p(10, 8, 103), p(0, 8, 103)] },
  ],
  przeszkody: [
    { nazwa: "Brzoza", punkt: p(5, -15), wysokoscM: "12", promienM: "3" },
    { nazwa: "Niewpisana", punkt: p(20, 20), wysokoscM: "", promienM: "2" },
  ],
}
const PROGNOZA = { wysokosci: { Brzoza: "18" }, lat: "10" }

describe("liczba", () => {
  it("puste → undefined, przecinek dziesiętny akceptowany, śmieci → undefined", () => {
    expect(liczba("")).toBeUndefined()
    expect(liczba(" 2,5 ")).toBe(2.5)
    expect(liczba("abc")).toBeUndefined()
  })
})

describe("wejscieSkanera", () => {
  it("przeszkoda z niepełnymi polami nie trafia do obliczeń (nie jako 0 m)", () => {
    const w = wejscieSkanera(MODEL)
    expect(w.przeszkody).toEqual([{ nazwa: "Brzoza", punkt: MODEL.przeszkody[0]!.punkt, wysokoscM: 12, promienM: 3 }])
  })

  it("kalibracja: numery punktów od 1 → indeksy od 0; niepełna → brak kalibracji", () => {
    const k = { zbior: "budynek" as const, punktA: "1", punktB: "2", znanaDlugoscM: "10" }
    expect(wejscieSkanera({ ...MODEL, kalibracja: k }).kalibracja).toEqual({ zbior: "budynek", indeksA: 0, indeksB: 1, znanaDlugoscM: 10 })
    expect(wejscieSkanera({ ...MODEL, kalibracja: { ...k, znanaDlugoscM: "" } }).kalibracja).toBeUndefined()
  })

  it("pusty model → puste wejście (Skaner zwraca INCOMPLETE, nie błąd)", () => {
    expect(calculateSkanerDzialki(wejscieSkanera(MODEL_PUSTY)).status).toBe("INCOMPLETE")
  })
})

describe("polacieLokalne / punktyProbkowania", () => {
  const wynik = calculateSkanerDzialki(wejscieSkanera(MODEL)).value

  it("połacie w metrach nad gruntem budynku, z orientacją ze Skanera", () => {
    const [s, n] = polacieLokalne(MODEL, wynik)
    expect(s!.nazwa).toBe("Połać S")
    expect(s!.punkty[0]!.z).toBeCloseTo(3, 9)
    expect(s!.punkty[2]!.x).toBeCloseTo(10, 1)
    expect(s!.punkty[2]!.y).toBeCloseTo(4, 1)
    expect(s!.azymutDeg).toBeCloseTo(180, 0)
    expect(n!.azymutDeg).toBeCloseTo(0, 0)
    // atan(2/4) = 26,57°
    expect(s!.nachylenieDeg).toBeCloseTo(26.57, 1)
  })

  it("bez wysokości narożników budynku → brak połaci lokalnych (nie zgadujemy poziomu gruntu)", () => {
    const bezGruntu = { ...MODEL, budynek: MODEL.budynek.map(({ szerokosc, dlugosc }) => ({ szerokosc, dlugosc })) }
    expect(polacieLokalne(bezGruntu, calculateSkanerDzialki(wejscieSkanera(bezGruntu)).value)).toEqual([])
  })

  it("dach wg obrysu: punkty obrysu na zadanej wysokości, orientacja paneli z formularza", () => {
    const d = dachWedlugObrysu(wynik, 6, 30, 170)!
    expect(d.punkty).toHaveLength(4)
    expect(d.punkty.every((q) => q.z === 6)).toBe(true)
    expect(d).toMatchObject({ nachylenieDeg: 30, azymutDeg: 170 })
    expect(punktyProbkowania(d, 3).every((q) => Math.abs(q.z - 6) < 1e-9)).toBe(true)
    expect(dachWedlugObrysu(calculateSkanerDzialki(wejscieSkanera({ ...MODEL_PUSTY, dzialka: MODEL.budynek })).value, 6, 30, 170)).toBeNull()
  })

  it("siatka próbkowania: punkty wewnątrz obrysu, na płaszczyźnie połaci", () => {
    const s = polacieLokalne(MODEL, wynik)[0]!
    const pk = punktyProbkowania(s, 4)
    expect(pk).toHaveLength(16)
    for (const q of pk) {
      expect(q.x).toBeGreaterThan(0)
      expect(q.x).toBeLessThan(10.01)
      // Płaszczyzna S: z = 3 + y/2.
      expect(q.z).toBeCloseTo(3 + q.y / 2, 2)
    }
  })
})

describe("przeszkodyZacienienia / wejscieZacienienia", () => {
  const wynik = calculateSkanerDzialki(wejscieSkanera(MODEL)).value

  it("bez prognozy → drzewo bez wysokości prognozowanej (brak scenariusza, nie zgadywana krzywa wzrostu)", () => {
    expect(przeszkodyZacienienia(wynik, { wysokosci: {}, lat: "" })[0]).not.toHaveProperty("wysokoscPrognozowanaM")
  })

  it("przeszkody kompletne → drzewa z prognozą z formularza", () => {
    const d = przeszkodyZacienienia(wynik, PROGNOZA)
    expect(d).toHaveLength(1)
    expect(d[0]).toMatchObject({ typ: "drzewo", nazwa: "Brzoza", promienKoronyM: 3, wysokoscM: 12, wysokoscPrognozowanaM: 18 })
    expect(d[0]!.srodek.y).toBeCloseTo(-15, 1)
  })

  it("wejście E3: współrzędne z punktu odniesienia Skanera, orientacja połaci, horyzont prognozy", () => {
    const s = polacieLokalne(MODEL, wynik)[0]!
    const w = wejscieZacienienia(wynik, PROGNOZA, s, { x: 5, y: 2, z: 4 })
    expect(w).toMatchObject({ szerokoscGeograficzna: LAT0, dlugoscGeograficzna: LON0, punkt: { x: 5, y: 2, z: 4 }, latPrognozy: 10 })
    expect(w.azymutPowierzchniDeg).toBeCloseTo(180, 0)
  })
})

describe("elewacje / powierzchnieZModelu", () => {
  it("prostokąt → 4 elewacje N/E/S/W, od najdłuższej, pionowe", () => {
    const wynik = calculateSkanerDzialki(wejscieSkanera(MODEL)).value
    const e = elewacje(wynik)
    expect(e.map((x) => x.nazwa).sort()).toEqual(["Elewacja E", "Elewacja N", "Elewacja S", "Elewacja W"])
    expect(e[0]!.wymiar).toBeCloseTo(10, 1)
    expect(e.every((x) => x.nachylenieDeg === 90)).toBe(true)
  })

  it("ściany prawie równoległe (różnica < tolerancji) łączą się w jedną elewację, także przez 0°/360°", () => {
    // Północna ściana złamana: dwa odcinki o azymutach ~355° i ~5° → jedna elewacja N.
    const m: ModelDzialki = { ...MODEL_PUSTY, budynek: [p(0, 0), p(10, 0), p(10, 8), p(5, 8.44), p(0, 8)] }
    const e = elewacje(calculateSkanerDzialki(wejscieSkanera(m)).value)
    expect(e.filter((x) => x.nazwa === "Elewacja N")).toHaveLength(1)
    expect(e).toHaveLength(4)
  })

  it("powierzchnie E4: najpierw połacie (zaokrąglone), potem elewacje", () => {
    const pw = powierzchnieZModelu(calculateSkanerDzialki(wejscieSkanera(MODEL)).value)
    expect(pw[0]).toMatchObject({ nazwa: "Połać S", zrodlo: "polac", nachylenieDeg: 27, azymutDeg: 180 })
    expect(pw.filter((x) => x.zrodlo === "elewacja")).toHaveLength(4)
  })

  it("kierunek: 8 sektorów, 359° → N", () => {
    expect(kierunek(359)).toBe("N")
    expect(kierunek(135)).toBe("SE")
    expect(kierunek(250)).toBe("W")
  })
})

describe("powierzchnieDoOceny", () => {
  const zModelu = powierzchnieZModelu(calculateSkanerDzialki(wejscieSkanera(MODEL)).value)

  it("pusta korekta = wartość ze Skanera; wpisana korekta nadpisuje i jest oznaczona", () => {
    const id = zModelu[0]!.id
    const pw = powierzchnieDoOceny(zModelu, { [id]: { nachylenieDeg: "", azymutDeg: "175" } }, [])
    expect(pw[0]).toMatchObject({ nachylenieDeg: 27, azymutDeg: 175, skorygowana: true })
    expect(pw[1]).toMatchObject({ skorygowana: false })
    expect(pw).toHaveLength(zModelu.length)
  })

  it("dopisane ręcznie: tylko kompletne, bez nazwy → nazwa domyślna", () => {
    const pw = powierzchnieDoOceny([], {}, [
      { nazwa: "", nachylenieDeg: "35", azymutDeg: "180" },
      { nazwa: "Wiata", nachylenieDeg: "", azymutDeg: "90" },
    ])
    expect(pw).toEqual([{ id: "reczna-0", nazwa: "Powierzchnia 1", zrodlo: "reczna", nachylenieDeg: 35, azymutDeg: 180, wymiar: 0, skorygowana: false }])
  })
})

describe("horyzontyPolaci (zacienienie Ekranu 4)", () => {
  const w = calculateSkanerDzialki(wejscieSkanera(MODEL)).value

  it("profil 360° z każdego punktu siatki połaci, klucze = id powierzchni E4; elewacje bez profilu", () => {
    const h = horyzontyPolaci(MODEL, w)
    const idPolaci = powierzchnieZModelu(w).filter((x) => x.zrodlo === "polac").map((x) => x.id)
    expect(Object.keys(h).sort()).toEqual([...idPolaci].sort())
    const s = h[idPolaci[0]!]!
    expect(s.length).toBeGreaterThan(1)
    for (const profil of s) expect(profil).toHaveLength(360)
    // Brzoza 12 m na południu (środek x = 5 m, promień 3 m), połać 3–5 m nad gruntem: punkty siatki
    // w pasie x ∈ (2, 8) widzą ją dokładnie w azymucie 180°; od północy pusto.
    expect(Math.max(...s.map((profil) => profil[180]!))).toBeGreaterThan(0)
    for (const profil of s) expect(profil[0]).toBe(0)
  })

  it("bez przeszkód → profile zerowe (zacienienie sprawdzone, brak straty)", () => {
    const m = { ...MODEL, przeszkody: [] }
    const h = horyzontyPolaci(m, calculateSkanerDzialki(wejscieSkanera(m)).value)
    for (const profile of Object.values(h)) for (const profil of profile) expect(Math.max(...profil)).toBe(0)
  })

  it("punkty wewnątrz korony drzewa pominięte; połać w całości pod koroną → bez profilu", () => {
    const m: ModelDzialki = { ...MODEL, przeszkody: [{ nazwa: "Dąb", punkt: p(5, 4), wysokoscM: "15", promienM: "20" }] }
    expect(horyzontyPolaci(m, calculateSkanerDzialki(wejscieSkanera(m)).value)).toEqual({})
  })
})
