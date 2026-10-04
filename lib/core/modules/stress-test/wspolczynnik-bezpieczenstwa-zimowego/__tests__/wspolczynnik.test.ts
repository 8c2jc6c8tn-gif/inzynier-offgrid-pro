import { describe, expect, it } from "vitest"
import { agregujWskaznik } from "../aggregation"
import { calculateWspolczynnik } from "../calculator"
import { DOMYSLNE_WAGI_PCT, SKLADOWE } from "../constants"
import type { WspolczynnikInput } from "../input"
import { zAnalizySpof, zBlackoutu, zDeficytow, zStrategiiZamarzanie } from "../zrodla"

/** Scores: pokrycie 80, autonomia 60, odpornosc 90, agregat 70, reakcja 65 → 0,3·80+0,25·60+0,2·90+0,15·70+0,1·65 = 74. */
const BAZA: WspolczynnikInput = {
  produkcjaNajgorszyMiesiacKwh: 80,
  zapotrzebowanieNajgorszyMiesiacKwh: 100,
  autonomiaDni: 6,
  wymaganaAutonomiaDni: 10,
  liczbaKomponentow: 10,
  liczbaSpof: 1,
  brakAgregatu: false,
  mocAgregatuKw: 3.5,
  mocWymaganaAgregatuKw: 5,
  oknoReakcjiH: 6.5,
  wymaganyCzasReakcjiH: 10,
  wagiWlasne: null,
  progSlabegoPunktuPct: 70, // the user's threshold in these tests (D75: no default)
}

describe("calculateWspolczynnik (M7/E12, dawne 6.14)", () => {
  it("domyślne wagi 30/25/20/15/10 sumują się do 100", () => {
    expect(SKLADOWE.reduce((s, id) => s + DOMYSLNE_WAGI_PCT[id], 0)).toBe(100)
  })

  it("przykład źródła: wskaźnik 74%, słabe punkty = składowe poniżej progu 70%, najsłabsza = autonomia", () => {
    const w = calculateWspolczynnik(BAZA)
    expect(w.value.wskaznikPct).toBeCloseTo(74, 9)
    expect(w.value.zestawWag).toBe("domyslne")
    expect(w.value.najslabsza).toEqual({ id: "autonomia", wynikPct: 60 })
    expect(w.value.slabePunkty).toEqual(["autonomia", "reakcja"])
    expect(w.status).toBe("VALID_WITH_WARNINGS")
    expect(w.warnings.map((x) => x.code)).toEqual(["WSP-WAGI-WSTEPNE", "WSP-SLABY-AUTONOMIA", "WSP-SLABY-REAKCJA"])
    expect(w.warnings.some((x) => x.level === "critical")).toBe(false)
  })

  it("wkłady składowych sumują się do wskaźnika", () => {
    const w = calculateWspolczynnik(BAZA)
    expect(w.value.skladowe.reduce((s, c) => s + (c.wkladPkt ?? 0), 0)).toBeCloseTo(w.value.wskaznikPct!, 9)
  })

  it("odwzorowanie ✅🤖: stosunek obcięty do 100% (nadmiar nie jest nagradzany); SPOF = udział komponentów z redundancją", () => {
    const w = calculateWspolczynnik({ ...BAZA, produkcjaNajgorszyMiesiacKwh: 500, liczbaSpof: 0, liczbaKomponentow: 4 })
    const pokrycie = w.value.skladowe.find((c) => c.id === "pokrycie")!
    const odpornosc = w.value.skladowe.find((c) => c.id === "odpornosc")!
    expect(pokrycie.wynikPct).toBe(100)
    expect(odpornosc.wynikPct).toBe(100)
    expect(calculateWspolczynnik({ ...BAZA, liczbaSpof: 3, liczbaKomponentow: 4 }).value.skladowe.find((c) => c.id === "odpornosc")!.wynikPct).toBe(25)
  })

  it("brak agregatu → składowa agregatu 0% i słaby punkt", () => {
    const w = calculateWspolczynnik({ ...BAZA, brakAgregatu: true, mocAgregatuKw: null, mocWymaganaAgregatuKw: null })
    expect(w.status).not.toBe("INCOMPLETE")
    expect(w.value.skladowe.find((c) => c.id === "agregat")!.wynikPct).toBe(0)
    expect(w.value.najslabsza).toEqual({ id: "agregat", wynikPct: 0 })
    expect(w.value.slabePunkty[0]).toBe("agregat")
  })

  it("wszystko na 100% → VALID, bez słabych punktów", () => {
    const w = calculateWspolczynnik({
      ...BAZA,
      produkcjaNajgorszyMiesiacKwh: 100,
      autonomiaDni: 10,
      liczbaSpof: 0,
      mocAgregatuKw: 5,
      oknoReakcjiH: 10,
    })
    expect(w.value.wskaznikPct).toBeCloseTo(100, 9)
    expect(w.status).toBe("VALID")
    expect(w.value.slabePunkty).toEqual([])
  })

  it("własne wagi sumujące się do 100 zmieniają wskaźnik i zestaw wag", () => {
    const wagi = { pokrycie: 10, autonomia: 10, odpornosc: 10, agregat: 10, reakcja: 60 }
    const w = calculateWspolczynnik({ ...BAZA, wagiWlasne: wagi })
    expect(w.value.zestawWag).toBe("wlasne")
    expect(w.value.wskaznikPct).toBeCloseTo(0.1 * 80 + 0.1 * 60 + 0.1 * 90 + 0.1 * 70 + 0.6 * 65, 9)
    expect(w.warnings[0]!.code).toBe("WSP-WAGI-WLASNE")
  })

  it("wagi nie sumują się do 100 → INVALID_INPUT (krytyczny błąd walidacji, nie wynik)", () => {
    const w = calculateWspolczynnik({ ...BAZA, wagiWlasne: { pokrycie: 30, autonomia: 25, odpornosc: 20, agregat: 15, reakcja: 20 } })
    expect(w.status).toBe("INVALID_INPUT")
    expect(w.warnings[0]!.code).toBe("WSP-WAGI-SUMA")
    expect(w.warnings[0]!.params).toEqual({ suma: 110 })
    expect(w.value.wskaznikPct).toBeNull()
  })

  it("ujemna waga i SPOF ponad liczbę komponentów → INVALID_INPUT", () => {
    expect(calculateWspolczynnik({ ...BAZA, wagiWlasne: { pokrycie: -10, autonomia: 40, odpornosc: 30, agregat: 20, reakcja: 20 } }).warnings[0]!.code).toBe(
      "WSP-WARTOSC-UJEMNA",
    )
    expect(calculateWspolczynnik({ ...BAZA, liczbaSpof: 11 }).warnings[0]!.code).toBe("WSP-SPOF-PONAD-LICZBE")
  })

  it("brak danych składowej → INCOMPLETE z listą brakujących, bez wskaźnika z części", () => {
    const w = calculateWspolczynnik({ ...BAZA, autonomiaDni: null, oknoReakcjiH: null })
    expect(w.status).toBe("INCOMPLETE")
    expect(w.value.brakujace).toEqual(["autonomia", "reakcja"])
    expect(w.value.wskaznikPct).toBeNull()
    expect(w.value.skladowe.find((c) => c.id === "pokrycie")!.wynikPct).toBe(80)
  })
})

describe("agregujWskaznik — jedyny punkt agregacji", () => {
  it("średnia ważona i najsłabsza składowa (przy remisie pierwsza ze źródła)", () => {
    const wyniki = { pokrycie: 50, autonomia: 100, odpornosc: 100, agregat: 100, reakcja: 50 }
    const a = agregujWskaznik(wyniki, DOMYSLNE_WAGI_PCT)
    expect(a.wskaznikPct).toBeCloseTo(0.3 * 50 + 0.25 * 100 + 0.2 * 100 + 0.15 * 100 + 0.1 * 50, 9)
    expect(a.najslabsza).toEqual({ id: "pokrycie", wynikPct: 50 })
  })
})

describe("zrodla — wartości z zapisanych formularzy istniejących ekranów", () => {
  it("E2 deficyty: największy deficyt i moc agregatu; pusty szkic → null", () => {
    const d = zDeficytow({ deficyty: ["", "12", "40", "0"], moc: "5" })
    expect(d).toEqual({ najwiekszyDeficytKwh: 40, mocAgregatuKw: 5 })
    expect(zDeficytow(null)).toEqual({ najwiekszyDeficytKwh: null, mocAgregatuKw: null })
  })

  it("E4 blackout: 50 kWh, 100→10%, η 90%, 5 kWh/dobę, 14 dni → 8,1 dnia z 14", () => {
    const b = zBlackoutu({
      pojemnoscKwh: "50",
      socStartPct: "100",
      socMinPct: "10",
      sprawnoscFalownikaPct: "90",
      zuzycieDoboweKwh: "5",
      dniScenariusza: "14",
      agregatKwhDoba: "",
    })
    expect(b!.autonomiaDni).toBeCloseTo(8.1, 12)
    expect(b!.wymaganaAutonomiaDni).toBe(14)
    expect(zBlackoutu({ pojemnoscKwh: "", dniScenariusza: "14" })).toBeNull()
  })

  it("E10 SPOF: komponent bez redundancji liczy się jako SPOF", () => {
    const s = zAnalizySpof({
      komponenty: [
        { nazwa: "BMS", typ: "bms", maRedundancje: false },
        { nazwa: "pompa", typ: "pompa", maRedundancje: true },
      ],
    })
    expect(s).toEqual({ liczbaKomponentow: 2, liczbaSpof: 1 })
    expect(zAnalizySpof({ komponenty: [] })).toBeNull()
  })

  it("E6 strategia zamarzanie: czas krytycznych z silnika ekranu; niekompletny szkic → null", () => {
    const s = zStrategiiZamarzanie({
      pojemnoscKwh: "10",
      socPct: "50",
      socMinPct: "10",
      sprawnoscFalownikaPct: "90",
      odbiorniki: [{ nazwa: "pompa ciepła", mocW: 500, priorytet: 1 }],
    })
    expect(s!.czasKrytycznychH).toBeGreaterThan(0)
    expect(zStrategiiZamarzanie({ pojemnoscKwh: "", odbiorniki: [] })).toBeNull()
  })

  it("D75: bez progu wpisanego przez usera nie ma słabych punktów, tylko ranking od najsłabszej", () => {
    const w = calculateWspolczynnik({ ...BAZA, progSlabegoPunktuPct: null })
    expect(w.value.wskaznikPct).toBeCloseTo(74, 9)
    expect(w.value.slabePunkty).toEqual([])
    expect(w.value.ranking).toEqual(["autonomia", "reakcja", "agregat", "pokrycie", "odpornosc"])
    expect(w.value.najslabsza).toEqual({ id: "autonomia", wynikPct: 60 })
    expect(w.assumptions).toContainEqual({ kod: "WSP-ZALOZENIE-BEZ-PROGU" })
    expect(w.warnings.map((x) => x.code)).toEqual(["WSP-WAGI-WSTEPNE"])
  })

  it("D75: próg usera decyduje o słabych punktach; próg poza 0–100% → INVALID_INPUT", () => {
    expect(calculateWspolczynnik({ ...BAZA, progSlabegoPunktuPct: 62 }).value.slabePunkty).toEqual(["autonomia"])
    expect(calculateWspolczynnik({ ...BAZA, progSlabegoPunktuPct: 101 }).status).toBe("INVALID_INPUT")
    expect(calculateWspolczynnik({ ...BAZA, progSlabegoPunktuPct: -1 }).status).toBe("INVALID_INPUT")
  })
})
