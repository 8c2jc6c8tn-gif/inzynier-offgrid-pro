import { describe, expect, it } from "vitest"
import { calculateSkanerDzialki } from "../calculator"
import { WGS84_A, WGS84_E2 } from "../constants"
import { rzutujNaUkladLokalny } from "../geometria"
import type { PunktGps } from "../input"

const RAD = Math.PI / 180
const ODN: PunktGps = { szerokosc: 52.2297, dlugosc: 21.0122 }

/** Odwrotność rzutowania (test-helper): lokalne (x, y) [m] → GPS wokół ODN. */
function gps(x: number, y: number, wysokoscM?: number): PunktGps {
  const fi0 = ODN.szerokosc * RAD
  const w = 1 - WGS84_E2 * Math.sin(fi0) ** 2
  const n = WGS84_A / Math.sqrt(w)
  const m = (WGS84_A * (1 - WGS84_E2)) / w ** 1.5
  return { szerokosc: ODN.szerokosc + y / m / RAD, dlugosc: ODN.dlugosc + x / (n * Math.cos(fi0)) / RAD, wysokoscM }
}

/** Prostokąt a×b [m] obrócony o `obrot` stopni (zgodnie z ruchem wskazówek zegara), narożniki CCW. */
function prostokat(a: number, b: number, obrot = 0, z?: number): PunktGps[] {
  const c = Math.cos(obrot * RAD)
  const s = Math.sin(obrot * RAD)
  return [
    [0, 0],
    [a, 0],
    [a, b],
    [0, b],
  ].map(([x, y]) => gps(x! * c + y! * s, -x! * s + y! * c, z))
}

const posortowane = (a: number[]) => [...a].map((v) => Math.round(v * 1e6) / 1e6).sort((x, y) => x - y)

describe("rzutujNaUkladLokalny — długość stopnia na równiku (WGS84)", () => {
  it("0,001° szerokości = 110,574 m, 0,001° długości = 111,320 m", () => {
    const o = { szerokosc: 0, dlugosc: 0 }
    expect(rzutujNaUkladLokalny({ szerokosc: 0.001, dlugosc: 0 }, o).y).toBeCloseTo(110.574, 2)
    expect(rzutujNaUkladLokalny({ szerokosc: 0, dlugosc: 0.001 }, o).x).toBeCloseTo(111.3195, 3)
  })
})

describe("calculateSkanerDzialki", () => {
  it("brak punktów → INCOMPLETE", () => {
    expect(calculateSkanerDzialki({}).status).toBe("INCOMPLETE")
  })

  it("działka 30×20 m: pole 600 m², obwód 100 m", () => {
    const r = calculateSkanerDzialki({ punktyDzialki: prostokat(30, 20) })
    expect(r.value.dzialka!.powierzchniaM2).toBeCloseTo(600, 6)
    expect(r.value.dzialka!.obwodM).toBeCloseTo(100, 6)
  })

  it("budynek 12×8 m wzdłuż osi: ściany patrzą na N/E/S/W, niezależnie od kierunku obchodzenia", () => {
    const ccw = calculateSkanerDzialki({ punktyBudynku: prostokat(12, 8) })
    const cw = calculateSkanerDzialki({ punktyBudynku: [...prostokat(12, 8)].reverse() })
    expect(posortowane(ccw.value.budynek!.sciany.map((s) => s.azymutDeg))).toEqual([0, 90, 180, 270])
    expect(posortowane(cw.value.budynek!.sciany.map((s) => s.azymutDeg))).toEqual([0, 90, 180, 270])
    expect(ccw.value.budynek!.powierzchniaM2).toBeCloseTo(96, 6)
  })

  it("budynek obrócony o 30°: ściany patrzą na 30°/120°/210°/300°", () => {
    const r = calculateSkanerDzialki({ punktyBudynku: prostokat(12, 8, 30) })
    expect(posortowane(r.value.budynek!.sciany.map((s) => s.azymutDeg))).toEqual([30, 120, 210, 300])
  })

  it("ściana południowa (dolna krawędź prostokąta CCW) patrzy na 180°", () => {
    const r = calculateSkanerDzialki({ punktyBudynku: prostokat(12, 8) })
    const poludniowa = r.value.budynek!.sciany.find((s) => s.od === 0)!
    expect(poludniowa.azymutDeg).toBeCloseTo(180, 6)
    expect(poludniowa.dlugoscM).toBeCloseTo(12, 6)
  })

  it("kalibracja: GPS zmierzył ścianę 12,6 m, taśma 12 m → skala 12/12,6, pole × skala²", () => {
    const r = calculateSkanerDzialki({
      punktyBudynku: prostokat(12.6, 8.4),
      kalibracja: { zbior: "budynek", indeksA: 0, indeksB: 1, znanaDlugoscM: 12 },
    })
    const s = 12 / 12.6
    expect(r.value.skalaKalibracji).toBeCloseTo(s, 9)
    expect(r.value.budynek!.sciany[0]!.dlugoscM).toBeCloseTo(12, 6)
    expect(r.value.budynek!.powierzchniaM2).toBeCloseTo(12.6 * 8.4 * s * s, 6)
    expect(r.assumptions).toContainEqual({ kod: "SKANER-ZALOZENIE-KALIBRACJA-POZIOMA" })
  })

  it("połać nachylona 35° w stronę południa: β = 35°, azymut 180°, pole rzeczywiste = rzut / cos β", () => {
    const tg = Math.tan(35 * RAD)
    const grunt = 100
    const okap = grunt + 3
    // Dół połaci na południu (y = 0), góra na północy (y = 5): spadek w stronę południa.
    const punkty = [gps(0, 0, okap), gps(10, 0, okap), gps(10, 5, okap + 5 * tg), gps(0, 5, okap + 5 * tg)]
    const r = calculateSkanerDzialki({
      punktyBudynku: prostokat(10, 10, 0, grunt),
      polacie: [{ nazwa: "Połać S", punkty }],
    })
    const p = r.value.polacie[0]!
    expect(p.nachylenieDeg).toBeCloseTo(35, 6)
    expect(p.azymutDeg!).toBeCloseTo(180, 6)
    expect(p.poleRzutuM2).toBeCloseTo(50, 6)
    expect(p.poleRzeczywisteM2).toBeCloseTo(50 / Math.cos(35 * RAD), 6)
    expect(p.odchylenieOdPlaszczyznyM).toBeLessThan(1e-6)
    expect(r.value.wysokoscKalenicyM).toBeCloseTo(3 + 5 * tg, 6)
  })

  it("połać płaska: β = 0, azymut nieokreślony (null)", () => {
    const r = calculateSkanerDzialki({
      punktyBudynku: prostokat(10, 10),
      polacie: [{ nazwa: "Stropodach", punkty: prostokat(10, 10, 0, 106) }],
    })
    expect(r.value.polacie[0]!.nachylenieDeg).toBeCloseTo(0, 6)
    expect(r.value.polacie[0]!.azymutDeg).toBeNull()
  })

  it("połacie bez wysokości narożników budynku → kalenica nieznana, ostrzeżenie info", () => {
    const r = calculateSkanerDzialki({
      punktyBudynku: prostokat(10, 10),
      polacie: [{ nazwa: "Stropodach", punkty: prostokat(10, 10, 0, 106) }],
    })
    expect(r.value.wysokoscKalenicyM).toBeNull()
    expect(r.status).toBe("VALID_WITH_WARNINGS")
    expect(r.warnings[0]!.code).toBe("SKANER-BRAK-WYSOKOSCI-GRUNTU")
  })

  it("przeszkoda przeniesiona do układu lokalnego (wejście Ekranu 3)", () => {
    const r = calculateSkanerDzialki({
      punktyDzialki: prostokat(30, 20),
      przeszkody: [{ typ: "walec", nazwa: "Dąb", punkt: gps(5, -12), wysokoscM: 15, promienM: 3 }],
    })
    const p = r.value.przeszkody[0]!
    expect(p.typ).toBe("walec")
    if (p.typ !== "walec") return
    expect(p.x).toBeCloseTo(5, 6)
    expect(p.y).toBeCloseTo(-12, 6)
  })

  it("przeszkoda-obrys (sąsiedni budynek) → wielokąt w układzie lokalnym, z kalibracją poziomą (TD17)", () => {
    const r = calculateSkanerDzialki({
      punktyBudynku: prostokat(10, 8),
      przeszkody: [{ typ: "obrys", nazwa: "Sąsiad", obrys: [gps(-10, -12), gps(20, -12), gps(20, -8), gps(-10, -8)], wysokoscM: 7 }],
      // Taśma: ściana 10 m GPS zmierzona jako 11 m → skala 1,1 także dla obrysu przeszkody.
      kalibracja: { zbior: "budynek", indeksA: 0, indeksB: 1, znanaDlugoscM: 11 },
    })
    expect(r.status).toBe("VALID")
    const p = r.value.przeszkody[0]!
    expect(p).toMatchObject({ typ: "obrys", nazwa: "Sąsiad", wysokoscM: 7 })
    if (p.typ !== "obrys") return
    expect(p.obrys).toHaveLength(4)
    expect(p.obrys[1]!.x).toBeCloseTo(22, 4)
    expect(p.obrys[1]!.y).toBeCloseTo(-13.2, 4)
  })

  it("przeszkoda-obrys: < 3 narożniki albo ujemna wysokość → INVALID_INPUT", () => {
    const zaMalo = calculateSkanerDzialki({
      punktyDzialki: prostokat(30, 20),
      przeszkody: [{ typ: "obrys", nazwa: "Sąsiad", obrys: [gps(0, -10), gps(10, -10)], wysokoscM: 7 }],
    })
    expect(zaMalo.status).toBe("INVALID_INPUT")
    expect(zaMalo.warnings.map((w) => w.code)).toContain("SKANER-ZA-MALO-PUNKTOW")
    const ujemna = calculateSkanerDzialki({
      punktyDzialki: prostokat(30, 20),
      przeszkody: [{ typ: "obrys", nazwa: "Sąsiad", obrys: [gps(0, -10), gps(10, -10), gps(10, -14)], wysokoscM: -1 }],
    })
    expect(ujemna.status).toBe("INVALID_INPUT")
    expect(ujemna.warnings.map((w) => w.code)).toContain("SKANER-PRZESZKODA-OBRYS-NIEPOPRAWNA")
  })

  it("za mało punktów działki → INVALID_INPUT", () => {
    const r = calculateSkanerDzialki({ punktyDzialki: prostokat(30, 20).slice(0, 2) })
    expect(r.status).toBe("INVALID_INPUT")
    expect(r.warnings[0]!.code).toBe("SKANER-ZA-MALO-PUNKTOW")
  })

  it("połać bez wysokości GPS → INVALID_INPUT", () => {
    const r = calculateSkanerDzialki({ punktyBudynku: prostokat(10, 10), polacie: [{ nazwa: "X", punkty: prostokat(10, 10) }] })
    expect(r.status).toBe("INVALID_INPUT")
    expect(r.warnings.map((w) => w.code)).toContain("SKANER-POLAC-BEZ-WYSOKOSCI")
  })

  it("kalibracja z indeksem spoza zbioru → INVALID_INPUT", () => {
    const r = calculateSkanerDzialki({
      punktyBudynku: prostokat(10, 10),
      kalibracja: { zbior: "budynek", indeksA: 0, indeksB: 9, znanaDlugoscM: 10 },
    })
    expect(r.status).toBe("INVALID_INPUT")
  })

  it("szerokość geograficzna 95° → INVALID_INPUT", () => {
    const r = calculateSkanerDzialki({ punktyDzialki: [{ szerokosc: 95, dlugosc: 0 }, ...prostokat(10, 10)] })
    expect(r.status).toBe("INVALID_INPUT")
  })
})
