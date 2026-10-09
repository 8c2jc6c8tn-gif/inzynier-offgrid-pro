import { describe, expect, it } from "vitest"
import { BOS_DOMYSLNIE_WYLACZONE, iloscBos, obliczBos, type WejscieBos } from "../bos"

/** 2 stringi po 6 paneli (12 paneli), 1 wejście MPPT w użyciu, trasa 15 m w jedną stronę, ochrona stringów niewymagana (≤ 2 stringi). */
const wejscie = (zmiana: Partial<WejscieBos> = {}): WejscieBos => ({ stringow: 2, paneli: 12, wejscUzytych: 1, ochronaStringowWymagana: false, dlugoscTrasyM: 15, ...zmiana })

describe("iloscBos", () => {
  it("kabel = 2 · trasa · stringi, MC4 = 2 pary na string, konstrukcja = liczba paneli", () => {
    expect(iloscBos(wejscie())).toEqual({
      "kabel-pv": 60,
      mc4: 4,
      "bezpiecznik-dc": 0,
      "rozlacznik-dc": 1,
      "spd-dc": 1,
      "rozdzielnia-dc": 2,
      konstrukcja: 12,
    })
  })

  it("bezpieczniki dochodzą tylko przy obowiązku zabezpieczenia stringów; bez długości trasy kabla brak ilości (nie zero)", () => {
    expect(iloscBos(wejscie({ stringow: 4, ochronaStringowWymagana: true }))["bezpiecznik-dc"]).toBe(4)
    expect(iloscBos(wejscie({ dlugoscTrasyM: null }))["kabel-pv"]).toBeNull()
  })
})

describe("obliczBos", () => {
  const opcje = { wylaczone: BOS_DOMYSLNIE_WYLACZONE, cenyNadpisane: {}, kurs: 1 }

  it("ceny brutto = netto × 1,23; suma jako zakres z pominięciem rozdzielni", () => {
    const w = obliczBos(wejscie(), opcje)
    const linia = (id: string) => w.linie.find((l) => l.id === id)!
    // kabel: 60 m × 3,89 / 4,60 zł netto
    expect(linia("kabel-pv").sumaMin).toBeCloseTo(60 * 3.89 * 1.23, 6)
    expect(linia("kabel-pv").sumaMax).toBeCloseTo(60 * 4.6 * 1.23, 6)
    expect(linia("rozdzielnia-dc").wliczona).toBe(false)
    expect(linia("rozdzielnia-dc").sumaMin).toBeNull()
    const oczekiwanaMin = (60 * 3.89 + 4 * 2.93 + 0 + 1 * 31.71 + 1 * 43.9 + 12 * 167) * 1.23
    const oczekiwanaMax = (60 * 4.6 + 4 * 2.93 + 0 + 1 * 216 + 1 * 43.9 + 12 * 225) * 1.23
    expect(w.sumaMin).toBeCloseTo(oczekiwanaMin, 6)
    expect(w.sumaMax).toBeCloseTo(oczekiwanaMax, 6)
    expect(w.brakIlosci).toEqual([])
  })

  it("nadpisana cena zastępuje zakres (min = max), kurs przelicza cennik, a wyłączona pozycja nie wchodzi do sumy", () => {
    const w = obliczBos(wejscie(), { wylaczone: ["rozdzielnia-dc", "konstrukcja"], cenyNadpisane: { "kabel-pv": 5 }, kurs: 0.25 })
    const kabel = w.linie.find((l) => l.id === "kabel-pv")!
    expect(kabel).toMatchObject({ nadpisanaCena: true, cenaMin: 5, cenaMax: 5, sumaMin: 300, sumaMax: 300 })
    const mc4 = w.linie.find((l) => l.id === "mc4")!
    expect(mc4.cenaMin).toBeCloseTo(2.93 * 1.23 * 0.25, 9)
    expect(w.linie.find((l) => l.id === "konstrukcja")!.sumaMin).toBeNull()
    expect(w.sumaMin).toBeCloseTo(300 + 4 * 2.93 * 1.23 * 0.25 + 31.71 * 1.23 * 0.25 + 43.9 * 1.23 * 0.25, 6)
  })

  it("wliczony kabel bez długości trasy: pozycja zgłoszona w brakIlosci i pominięta w sumie", () => {
    const w = obliczBos(wejscie({ dlugoscTrasyM: null }), opcje)
    expect(w.brakIlosci).toEqual(["kabel-pv"])
    expect(w.linie.find((l) => l.id === "kabel-pv")!.sumaMin).toBeNull()
  })
})
