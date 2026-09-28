import { describe, expect, it } from "vitest"
import { calculateMikroinwerteryVsCentralny } from "../calculator"
import { KRYTERIA_POROWNANIA } from "../constants"

describe("calculateMikroinwerteryVsCentralny (M3/E21)", () => {
  it("zacienienie + falownik wyspowy z AC-coupling → mikroinwertery + 🟡 zgodność modelu", () => {
    const wynik = calculateMikroinwerteryVsCentralny({ regularneZacienienie: true, falownikWyspowyAcCoupling: "tak" })
    expect(wynik.value.rekomendacja).toBe("mikroinwertery")
    expect(wynik.status).toBe("VALID_WITH_WARNINGS")
    expect(wynik.warnings.map((w) => [w.code, w.level])).toEqual([
      ["REKOMENDACJA-MIKROINWERTERY", "info"],
      ["MIKROINWERTER-OFFGRID-SPRZEZENIE-AC", "warning"],
    ])
  })

  it.each(["nie", "nie-wiem"] as const)("zacienienie + falownik wyspowy „%s” → 🔴 (twardy stop)", (falownik) => {
    const wynik = calculateMikroinwerteryVsCentralny({ regularneZacienienie: true, falownikWyspowyAcCoupling: falownik })
    expect(wynik.value.rekomendacja).toBe("mikroinwertery")
    expect(wynik.status).toBe("VALID_WITH_WARNINGS")
    expect(wynik.warnings.map((w) => [w.code, w.level])).toEqual([
      ["REKOMENDACJA-MIKROINWERTERY", "info"],
      ["MIKROINWERTER-OFFGRID-BEZ-FALOWNIKA-WYSPOWEGO", "critical"],
    ])
  })

  it("zacienienie bez odpowiedzi o falownik → INCOMPLETE, rekomendacja widoczna z 🟡 (nigdy domyślne „tak”)", () => {
    const wynik = calculateMikroinwerteryVsCentralny({ regularneZacienienie: true, falownikWyspowyAcCoupling: null })
    expect(wynik.status).toBe("INCOMPLETE")
    expect(wynik.value.rekomendacja).toBe("mikroinwertery")
    expect(wynik.warnings.map((w) => w.code)).toEqual(["REKOMENDACJA-MIKROINWERTERY", "MIKROINWERTER-OFFGRID-SPRZEZENIE-AC"])
  })

  it("brak zacienienia → inwerter centralny, VALID (tylko info), pytanie o falownik bez znaczenia", () => {
    for (const falownik of [null, "nie"] as const) {
      const wynik = calculateMikroinwerteryVsCentralny({ regularneZacienienie: false, falownikWyspowyAcCoupling: falownik })
      expect(wynik.value.rekomendacja).toBe("centralny")
      expect(wynik.status).toBe("VALID")
      expect(wynik.warnings.map((w) => w.code)).toEqual(["REKOMENDACJA-INWERTER-CENTRALNY"])
    }
  })

  it("brak odpowiedzi → INCOMPLETE, bez rekomendacji (nigdy domyślne „brak zacienienia”)", () => {
    const wynik = calculateMikroinwerteryVsCentralny({ regularneZacienienie: null, falownikWyspowyAcCoupling: null })
    expect(wynik.status).toBe("INCOMPLETE")
    expect(wynik.value.rekomendacja).toBeNull()
    expect(wynik.warnings).toEqual([])
  })

  it("tabela porównawcza: 4 kryteria 1:1 ze źródła (bez dopisanej „sprawności”)", () => {
    expect(KRYTERIA_POROWNANIA.map((k) => k.id)).toEqual(["zacienienie", "monitoring", "koszt", "niezawodnosc"])
  })
})
