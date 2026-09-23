import { describe, expect, it } from "vitest"
import { calculateAnalizaZacienienia } from "../calculator"
import type { AnalizaZacienieniaInput, PrzeszkodaBryla, PrzeszkodaDrzewo } from "../input"
import { katPrzeszkodyDeg } from "../przeszkody"

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
