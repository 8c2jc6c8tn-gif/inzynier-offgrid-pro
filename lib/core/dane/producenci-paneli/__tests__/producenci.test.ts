import { describe, expect, it } from "vitest"
import { KATALOG_PANELI_PV } from "../../katalog-paneli-pv"
import { DATA_PRZEGLADU_PRODUCENTOW, lataJakoZakresy, opisProducenta, OPISY_PRODUCENTOW } from "../index"

describe("opisy producentów paneli (spec 15, Etap C)", () => {
  it("każdy producent z katalogu paneli ma opis, a każdy opis odpowiada producentowi z katalogu", () => {
    const zKatalogu = [...new Set(KATALOG_PANELI_PV.map((p) => p.producent))].sort()
    expect(OPISY_PRODUCENTOW.map((o) => o.producent).sort()).toEqual(zKatalogu)
    for (const nazwa of zKatalogu) expect(opisProducenta(nazwa)).toBeDefined()
  })

  it("każdy fakt ma źródło: adres https i tytuł; data przeglądu jest datą ISO nie z przyszłości", () => {
    expect(DATA_PRZEGLADU_PRODUCENTOW).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(new Date(DATA_PRZEGLADU_PRODUCENTOW).getTime()).toBeLessThanOrEqual(Date.now())
    for (const o of OPISY_PRODUCENTOW) {
      expect(o.fakty.length).toBeGreaterThan(0)
      for (const f of o.fakty) {
        expect(f.zrodlo.url).toMatch(/^https:\/\/[^\s]+$/)
        expect(f.zrodlo.tytul.length).toBeGreaterThan(5)
      }
    }
  })

  it("lata testu PVEL są rosnące, bez powtórzeń i z sensownego zakresu", () => {
    for (const o of OPISY_PRODUCENTOW) {
      for (const f of o.fakty) {
        if (f.rodzaj !== "pvel") continue
        const lata = [...f.lata]
        expect(lata).toEqual([...new Set(lata)].sort((a, b) => a - b))
        expect(lata.every((r) => r >= 2014 && r <= 2026)).toBe(true)
      }
    }
  })

  it("brakujące dane są jawne: producent bez roku założenia ma go na liście „nieustalono”, a pozostali mają rok", () => {
    for (const o of OPISY_PRODUCENTOW) {
      const maRok = o.fakty.some((f) => f.rodzaj === "zalozona")
      expect(maRok).toBe(!o.nieustalono.includes("rok-zalozenia"))
    }
  })

  it("zapis lat jako zakresy", () => {
    expect(lataJakoZakresy([2014, 2016, 2017, 2018, 2020])).toBe("2014, 2016–2018, 2020")
    expect(lataJakoZakresy([2019])).toBe("2019")
    expect(lataJakoZakresy([2018, 2017])).toBe("2017–2018")
  })
})
