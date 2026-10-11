import { describe, expect, it } from "vitest"
import { czyMikroinstalacja, PROFIL_OBIEKTU_POCZATKOWY, zuzycieMiesieczneKwh } from "../profil-obiektu"
import { dobowaWhNaMiesiac, dobowaWhZOdbiornikow, maOdbiornikiSezonowe, zuzycieMikroinstalacjiKwh } from "../zuzycie-z-odbiornikow"

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

describe("odbiorniki sezonowe (miesiące pracy urządzenia)", () => {
  const maj_wrzesien = lato
  const listopad_marzec = Array.from({ length: 12 }, (_, i) => i >= 10 || i <= 2)
  const lodowka = urzadzenie(45, 24, { id: "lodowka", cykliczne: true, wspolczynnikPracyPct: 40 }) // 432 Wh całoroczne
  const grzalka = urzadzenie(1000, 2, { id: "grzalka", miesiace: maj_wrzesien }) // 2000 Wh latem
  const postojowe = urzadzenie(20, 8, { id: "postojowe", miesiace: listopad_marzec }) // 160 Wh zimą
  const caly_rok = Array(12).fill(true)

  it("dobowe zużycie per miesiąc: lato 432 + 2000, zima 432 + 160, przejście tylko 432", () => {
    const d = dobowaWhNaMiesiac({ urzadzenia: [lodowka, grzalka, postojowe] })!
    expect(d[4]).toBeCloseTo(2432, 9) // maj
    expect(d[0]).toBeCloseTo(592, 9) // styczeń
    expect(d[10]).toBeCloseTo(592, 9) // listopad
    expect(d[3]).toBeCloseTo(432, 9) // kwiecień
    expect(d[9]).toBeCloseTo(432, 9) // październik
  })

  it("zużycie miesięczne w kWh: styczeń 592 Wh × 31 dni = 18,352; maj 2432 × 31 = 75,392; kwiecień 432 × 30 = 12,96", () => {
    const z = zuzycieMikroinstalacjiKwh({ urzadzenia: [lodowka, grzalka, postojowe] }, { rodzaj: "kamper", miesiaceUzytkowania: caly_rok })!
    expect(z[0]).toBeCloseTo(18.352, 9)
    expect(z[4]).toBeCloseTo(75.392, 9)
    expect(z[3]).toBeCloseTo(12.96, 9)
  })

  it("obiekt używany tylko latem: ogrzewanie postojowe zimą nie wchodzi, a miesiące poza użytkowaniem dają 0", () => {
    const z = zuzycieMikroinstalacjiKwh({ urzadzenia: [lodowka, grzalka, postojowe] }, { rodzaj: "altana-rod", miesiaceUzytkowania: maj_wrzesien })!
    expect(z[4]).toBeCloseTo(75.392, 9)
    expect(z[0]).toBe(0)
  })

  it("lista bez miesięcy liczy się jak dawniej (każde urządzenie we wszystkich miesiącach użytkowania)", () => {
    const draft = { urzadzenia: [urzadzenie(45, 24, { cykliczne: true, wspolczynnikPracyPct: 40 }), urzadzenie(10, 5)] }
    expect(maOdbiornikiSezonowe(draft)).toBe(false)
    expect(zuzycieMikroinstalacjiKwh(draft, { rodzaj: "kamper", miesiaceUzytkowania: lato })![4]).toBeCloseTo((482 * 31) / 1000, 9)
    expect(maOdbiornikiSezonowe({ urzadzenia: [grzalka] })).toBe(true)
    // all 12 flags set = not seasonal
    expect(maOdbiornikiSezonowe({ urzadzenia: [urzadzenie(10, 5, { miesiace: caly_rok })] })).toBe(false)
  })

  it("jedyne urządzenie pracuje poza miesiącami użytkowania obiektu → brak zużycia (null), nie zero; niekompletny cyklik unieważnia całość", () => {
    expect(zuzycieMikroinstalacjiKwh({ urzadzenia: [postojowe] }, { rodzaj: "garaz", miesiaceUzytkowania: maj_wrzesien })).toBeNull()
    const niekompletny = urzadzenie(45, 24, { cykliczne: true, wspolczynnikPracyPct: 0, miesiace: maj_wrzesien })
    expect(dobowaWhNaMiesiac({ urzadzenia: [lodowka, niekompletny] })).toBeNull()
  })

  it("zepsuta tablica miesięcy (nie 12 pozycji) = urządzenie we wszystkich miesiącach", () => {
    const d = dobowaWhNaMiesiac({ urzadzenia: [urzadzenie(10, 5, { miesiace: [true, false] })] })!
    expect(d.every((x) => x === 50)).toBe(true)
  })
})

