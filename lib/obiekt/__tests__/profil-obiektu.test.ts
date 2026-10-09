import { describe, expect, it } from "vitest"
import { czyMikroinstalacja, PROFIL_OBIEKTU_POCZATKOWY, zuzycieMiesieczneKwh } from "../profil-obiektu"
import { dobowaWhZOdbiornikow, zuzycieMikroinstalacjiKwh } from "../zuzycie-z-odbiornikow"

const urzadzenie = (mocW: number, godzinNaDobe: number, extra: object = {}) => ({
  id: "x", nazwa: "x", mocW, godzinNaDobe, cykliczne: false, wspolczynnikPracyPct: 0, ...extra,
})
const lato = Array.from({ length: 12 }, (_, i) => i >= 4 && i <= 8) // maj–wrzesień

describe("rodzaj obiektu", () => {
  it("mikroinstalacją są kamper, altana/ROD i garaż; budynek i brak wyboru nie", () => {
    expect(["kamper", "altana-rod", "garaz"].every((r) => czyMikroinstalacja(r as never))).toBe(true)
    expect(czyMikroinstalacja("budynek")).toBe(false)
    expect(czyMikroinstalacja("")).toBe(false)
    expect(czyMikroinstalacja(undefined)).toBe(false)
  })

  it("zużycie miesięczne: dobowe × dni tylko w miesiącach użytkowania (reszta 0), ręcznie policzone", () => {
    // 500 Wh/dobę: maj 31 dni = 15,5 kWh; czerwiec 30 = 15 kWh; lipiec 31 = 15,5; sierpień 31 = 15,5; wrzesień 30 = 15; reszta 0 → 76,5 kWh
    const z = zuzycieMiesieczneKwh(500, lato)!
    expect(z.map((x) => Math.round(x * 10) / 10)).toEqual([0, 0, 0, 0, 15.5, 15, 15.5, 15.5, 15, 0, 0, 0])
    expect(z.reduce((a, b) => a + b, 0)).toBeCloseTo(76.5, 9)
  })

  it("brak odbiorników albo miesięcy użytkowania = null, nie zero ani wartość domyślna", () => {
    expect(zuzycieMiesieczneKwh(0, lato)).toBeNull()
    expect(zuzycieMiesieczneKwh(500, PROFIL_OBIEKTU_POCZATKOWY.miesiaceUzytkowania)).toBeNull()
    expect(zuzycieMiesieczneKwh(500, [])).toBeNull()
  })
})

describe("zużycie mikroinstalacji z listy odbiorników", () => {
  it("lodówka 45 W × 24 h × 40% = 432 Wh + lampa 10 W × 5 h = 50 Wh → 482 Wh/dobę", () => {
    const draft = { urzadzenia: [urzadzenie(45, 24, { cykliczne: true, wspolczynnikPracyPct: 40 }), urzadzenie(10, 5)] }
    expect(dobowaWhZOdbiornikow(draft)).toBeCloseTo(482, 9)
    const profil = { rodzaj: "kamper" as const, miesiaceUzytkowania: lato }
    expect(zuzycieMikroinstalacjiKwh(draft, profil)![4]).toBeCloseTo((482 * 31) / 1000, 9)
  })

  it("odbiornik cykliczny bez współczynnika pracy = lista niekompletna = null", () => {
    expect(dobowaWhZOdbiornikow({ urzadzenia: [urzadzenie(45, 24, { cykliczne: true })] })).toBeNull()
    expect(dobowaWhZOdbiornikow({ urzadzenia: [] })).toBeNull()
    expect(dobowaWhZOdbiornikow(null)).toBeNull()
    expect(zuzycieMikroinstalacjiKwh({ urzadzenia: [urzadzenie(10, 5)] }, null)).toBeNull()
  })
})
