import { describe, expect, it } from "vitest"
import { calculateTrybOgraniczonegoZuzycia } from "@/lib/core/modules/zapotrzebowanie/tryb-ograniczonego-zuzycia/calculator"
import { odbiornikiDoTrybu, PUSTY_SEED_TRYBU, wejscieTrybu } from "../tryb-ograniczony-draft"
import type { DraftOdbiornikow } from "../zuzycie-z-odbiornikow"

const lista: DraftOdbiornikow = {
  urzadzenia: [
    { id: "l", nazwa: "Lodówka", mocW: 50, godzinNaDobe: 24, cykliczne: true, wspolczynnikPracyPct: 50 }, // 600 Wh
    { id: "t", nazwa: "Telewizor", mocW: 100, godzinNaDobe: 4, cykliczne: false, wspolczynnikPracyPct: 0 }, // 400 Wh
    { id: "k", nazwa: "Kamper-only", mocW: 10, godzinNaDobe: 1, cykliczne: false, wspolczynnikPracyPct: 0, obiekty: ["kamper"] }, // 10 Wh
    { id: "p", nazwa: "Pusty wiersz", mocW: 0, godzinNaDobe: 0, cykliczne: false, wspolczynnikPracyPct: 0 },
  ],
}

describe("odbiornikiDoTrybu", () => {
  it("dobowe zużycie z listy M12; co nie zostało zaznaczone, jest wyłączone; puste wiersze pomijane", () => {
    const o = odbiornikiDoTrybu(lista, "", { l: true })
    expect(o.map((x) => [x.id, x.zuzycieDobaWh, x.zostaje])).toEqual([
      ["l", 600, true],
      ["t", 400, false],
      ["k", 10, false],
    ])
  })

  it("rodzaj obiektu filtruje listę: dla garażu bez pozycji „tylko kamper”", () => {
    expect(odbiornikiDoTrybu(lista, "garaz", {}).map((x) => x.id)).toEqual(["l", "t"])
    expect(odbiornikiDoTrybu(lista, "kamper", {}).map((x) => x.id)).toEqual(["l", "t", "k"])
  })

  it("brak szkicu listy → pusta lista", () => {
    expect(odbiornikiDoTrybu(null, "", {})).toEqual([])
  })
})

describe("wejscieTrybu → silnik", () => {
  it("wyjazd 5 dób, lodówka zostaje: 0,6 kWh/dobę × 5 = 3 kWh zamiast 5,05", () => {
    const o = odbiornikiDoTrybu(lista, "", { l: true })
    const w = calculateTrybOgraniczonegoZuzycia(wejscieTrybu({ ...PUSTY_SEED_TRYBU, dni: "5" }, o)).value!
    expect(w.okresOgraniczoneKwh).toBeCloseTo(3, 10)
    expect(w.okresNormalnieKwh).toBeCloseTo(5.05, 10)
  })

  it("pola z przecinkiem i puste pola → null", () => {
    const w = wejscieTrybu({ ...PUSTY_SEED_TRYBU, tryb: "noc", godzinNocy: "8,5", pojemnoscKwh: "" }, [])
    expect(w.godzinNocy).toBe(8.5)
    expect(w.pojemnoscUzytecznaKwh).toBeNull()
    expect(w.dniNieobecnosci).toBeNull()
  })
})
