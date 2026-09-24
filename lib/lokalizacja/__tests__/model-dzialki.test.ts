import { describe, expect, it } from "vitest"
import { calculateAnalizaZacienienia } from "@/lib/core/modules/lokalizacja/analiza-zacienienia/calculator"
import { calculateSkanerDzialki } from "@/lib/core/modules/lokalizacja/skaner-dzialki/calculator"
import type { PunktGps } from "@/lib/core/modules/lokalizacja/skaner-dzialki/input"
import {
  dachWedlugObrysu,
  elewacje,
  kierunek,
  liczba,
  MODEL_PUSTY,
  polacieLokalne,
  powierzchnieDoOceny,
  powierzchnieZModelu,
  przeszkodaNiekompletna,
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
    expect(w.przeszkody).toEqual([{ typ: "walec", nazwa: "Brzoza", punkt: p(5, -15), wysokoscM: 12, promienM: 3 }])
  })

  it("przeszkoda-obrys: kompletna (≥ 3 narożniki + wysokość) → obrys; w trakcie obchodzenia → pominięta", () => {
    const obrys = [p(-10, -12), p(20, -12), p(20, -8), p(-10, -8)]
    const sasiad = { typ: "obrys" as const, nazwa: "Sąsiad", obrys, wysokoscM: "7" }
    expect(przeszkodaNiekompletna(sasiad)).toBe(false)
    expect(przeszkodaNiekompletna({ ...sasiad, obrys: obrys.slice(0, 2) })).toBe(true)
    expect(przeszkodaNiekompletna({ ...sasiad, wysokoscM: "" })).toBe(true)
    const w = wejscieSkanera({ ...MODEL, przeszkody: [sasiad, { ...sasiad, nazwa: "Niedokończony", obrys: obrys.slice(0, 1) }] })
    expect(w.przeszkody).toEqual([{ typ: "obrys", nazwa: "Sąsiad", obrys, wysokoscM: 7 }])
  })

  it("draft sprzed TD17 (przeszkoda bez pola typ) czyta się jako walec", () => {
    const stary = { nazwa: "Brzoza", punkt: p(5, -15), wysokoscM: "12", promienM: "3" }
    expect(wejscieSkanera({ ...MODEL, przeszkody: [stary] }).przeszkody?.[0]).toMatchObject({ typ: "walec", promienM: 3 })
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
    const drzewo = d[0]!
    if (drzewo.typ !== "drzewo") throw new Error("oczekiwano drzewa")
    expect(drzewo.srodek.y).toBeCloseTo(-15, 1)
  })

  it("przeszkoda-obrys → bryła E3 bez prognozy; horyzont na południu = atan(Δh / d) (TD17)", () => {
    // Długi, niski budynek sąsiada: 30 m wzdłuż osi wschód–zachód, 4 m głębokości, 10 m wysokości,
    // bliższa ściana 10 m na południe od punktu analizy (y = 2 → y = −8), punkt 4 m nad gruntem.
    const sasiad = { typ: "obrys" as const, nazwa: "Sąsiad", obrys: [p(-10, -12), p(20, -12), p(20, -8), p(-10, -8)], wysokoscM: "10" }
    const w = calculateSkanerDzialki(wejscieSkanera({ ...MODEL, przeszkody: [sasiad] })).value
    const przeszkody = przeszkodyZacienienia(w, PROGNOZA)
    expect(przeszkody).toHaveLength(1)
    expect(przeszkody[0]).toMatchObject({ typ: "bryla", nazwa: "Sąsiad", wysokoscM: 10 })
    expect(przeszkody[0]).not.toHaveProperty("wysokoscPrognozowanaM")
    const polac = polacieLokalne(MODEL, w)[0]!
    const r = calculateAnalizaZacienienia(wejscieZacienienia(w, PROGNOZA, polac, { x: 5, y: 2, z: 4 }))
    expect(r.status).toMatch(/^VALID/)
    const profil = r.value.obecnie.profilHoryzontuDeg
    // atan(6 / 10) = 30,964° (wartość referencyjna liczona niezależnie).
    expect(profil[180]).toBeCloseTo(30.964, 0)
    expect(profil[90]).toBe(0)
    expect(r.value.obecnie.strataRocznaProcent).toBeGreaterThan(0)
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
