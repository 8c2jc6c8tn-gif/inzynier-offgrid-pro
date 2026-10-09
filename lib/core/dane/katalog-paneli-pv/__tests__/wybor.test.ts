import { describe, expect, it } from "vitest"
import { KATALOG_PANELI_PV } from "../index"
import { etykietaMocy, mocSerii, producenciKatalogu, serieProducenta } from "../wybor"

describe("wybór z katalogu: producent → seria → moc", () => {
  it("producenci w kolejności katalogu, bez powtórzeń", () => {
    expect(producenciKatalogu()).toEqual(["JA Solar", "Astronergy", "Jinko", "LONGi", "Trina", "HD Hyundai"])
  })

  it("serie Jinko: trzy osobne modele, każdy raz", () => {
    expect(serieProducenta("Jinko")).toEqual(["Tiger Neo 48HL4M-BDV", "Tiger Neo 66HL4M-BDV", "Tiger Neo 72HL4-BDV"])
  })

  it("moce serii rosnąco; edycja z innego rynku dostaje dopisek, pozostałe nie", () => {
    const m72 = mocSerii("Jinko", "Tiger Neo 72HL4-BDV")
    expect(m72.map((p) => p.pmaxW)).toEqual([550, 555, 560, 565, 570, 575, 580, 585, 590, 595, 600])
    expect(m72.map(etykietaMocy).slice(0, 2)).toEqual(["550 W (CN)", "555 W (CN)"])
    expect(etykietaMocy(m72.at(-1)!)).toBe("600 W")
    expect(mocSerii("Jinko", "Tiger Neo 66HL4M-BDV").map(etykietaMocy).slice(0, 4)).toEqual(["590 W (EN/CEC)", "595 W (EN/CEC)", "600 W (EN/CEC)", "605 W"])
  })

  it("każdy wpis katalogu jest osiągalny tym wyborem i żadna para (seria, moc, rynek) się nie powtarza", () => {
    const klucze = new Set<string>()
    for (const prod of producenciKatalogu()) {
      for (const seria of serieProducenta(prod)) {
        for (const p of mocSerii(prod, seria)) {
          const klucz = `${prod}|${seria}|${etykietaMocy(p)}`
          expect(klucze.has(klucz), klucz).toBe(false)
          klucze.add(klucz)
        }
      }
    }
    expect(klucze.size).toBe(KATALOG_PANELI_PV.length)
  })
})
