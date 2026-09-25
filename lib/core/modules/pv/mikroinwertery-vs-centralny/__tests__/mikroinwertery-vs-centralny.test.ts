import { describe, expect, it } from "vitest"
import { calculateMikroinwerteryVsCentralny } from "../calculator"
import { KRYTERIA_POROWNANIA } from "../constants"

describe("calculateMikroinwerteryVsCentralny (M3/E21)", () => {
  it("regularne zacienienie → mikroinwertery (reguła źródła) + ostrzeżenie o sprzężeniu AC w off-gridzie", () => {
    const wynik = calculateMikroinwerteryVsCentralny({ regularneZacienienie: true })
    expect(wynik.value.rekomendacja).toBe("mikroinwertery")
    expect(wynik.status).toBe("VALID_WITH_WARNINGS")
    expect(wynik.warnings.map((w) => [w.code, w.level])).toEqual([
      ["REKOMENDACJA-MIKROINWERTERY", "info"],
      ["MIKROINWERTER-OFFGRID-SPRZEZENIE-AC", "warning"],
    ])
  })

  it("brak zacienienia → inwerter centralny, VALID (tylko info)", () => {
    const wynik = calculateMikroinwerteryVsCentralny({ regularneZacienienie: false })
    expect(wynik.value.rekomendacja).toBe("centralny")
    expect(wynik.status).toBe("VALID")
    expect(wynik.warnings.map((w) => w.code)).toEqual(["REKOMENDACJA-INWERTER-CENTRALNY"])
  })

  it("brak odpowiedzi → INCOMPLETE, bez rekomendacji (nigdy domyślne „brak zacienienia”)", () => {
    const wynik = calculateMikroinwerteryVsCentralny({ regularneZacienienie: null })
    expect(wynik.status).toBe("INCOMPLETE")
    expect(wynik.value.rekomendacja).toBeNull()
    expect(wynik.warnings).toEqual([])
  })

  it("tabela porównawcza: 4 kryteria 1:1 ze źródła (bez dopisanej „sprawności”)", () => {
    expect(KRYTERIA_POROWNANIA.map((k) => k.id)).toEqual(["zacienienie", "monitoring", "koszt", "niezawodnosc"])
  })
})
